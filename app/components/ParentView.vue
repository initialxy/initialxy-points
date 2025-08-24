<template>
  <div v-if="childrenData?.users.length ?? 0 > 0" class="max-w-100 mx-auto">
    <UCard
      v-for="child in childrenData?.users"
      :key="child.id"
      class="mb-4 clickable"
      variant="subtle"
      @click="navigateTo(`/child/${child.id}`)"
    >
      <div class="flex items-center justify-start">
        <h2 class="text-xl font-semibold grow min-w-0 truncate">
          {{ child.username }}
        </h2>
        <UBadge
          v-if="getNotificationsCount(child.id) > 0"
          variant="subtle"
          size="xl"
          icon="i-lucide-bell-ring"
          class="mx-2"
        >
          {{ getNotificationsCount(child.id) }}
        </UBadge>
        <div class="flex items-center space-x-2">
          <UButton
            icon="i-lucide-minus"
            color="error"
            variant="soft"
            size="xl"
            class="m-0 touch-manipulation"
            @click="changePoints(child, -1, $event)"
          />
          <UInput
            v-model="child.points"
            type="number"
            variant="none"
            class="w-15 m-0"
            size="xl"
            :ui="{ base: 'text-center' }"
            @update:modelValue="
              debouncedUpdatePoints(child.id, child.points || 0)
            "
            @click="$event.stopPropagation()"
          />
          <UButton
            icon="i-lucide-plus"
            color="success"
            variant="soft"
            size="xl"
            class="ml-0 touch-manipulation"
            @click="changePoints(child, 1, $event)"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const DEBOUNCE_WAIT_MS = 500

const emit = defineEmits<{
  (e: 'updatePoints', payload: { childId: number; points: number }): void
}>()

const toast = useToast()

const { data: childrenData, refresh } = await useLazyFetch<UsersResponse>(
  '/api/users',
  {
    query: { role: 'child' },
  }
)

const { data: tasksData } = await useLazyFetch<TasksResponse>('/api/tasks')
const { data: rewardsData } =
  await useLazyFetch<RewardsResponse>('/api/rewards')

// Keep track of points change by child during debounce, because API requires a
// points_change instead of updating raw points value to be more race condition
// resistant.
const pointsDeltaByUserId = new Map<number, number>()

const getNotificationsCount = (childId: number) => {
  let count = 0

  // Sum tasks and rewards that's awaiting parental approval
  const tasksCount = (tasksData.value?.tasks || []).filter(
    (task) => task.child_id === childId && task.is_marked_complete
  ).length

  const rewardsCount = (rewardsData.value?.rewards || []).filter(
    (reward) => reward.child_id === childId && reward.is_redemption_requested
  ).length

  return tasksCount + rewardsCount
}

const debouncedUpdatePoints = debounce(async (child: User, delta: number) => {
  try {
    await $fetch(`/api/users/${child.id}/points`, {
      method: 'PUT',
      body: { points_change: delta },
    })
    pointsDeltaByUserId.clear()
    await refresh()

    emit('updatePoints', { childId: child.id, points: child.points })
  } catch (err) {
    console.error('Error updating points:', err)
    toast.add({ title: 'Failed to update points', progress: false })
  }
}, DEBOUNCE_WAIT_MS)

const changePoints = async (child: User, delta: number, event: Event) => {
  event.stopPropagation()
  const updatedPoints = Math.max((child.points || 0) + delta, 0)
  const normalizedDelta = updatedPoints - (child.points || 0)
  child.points = updatedPoints

  const accumulatedDelta =
    (pointsDeltaByUserId.get(child.id) || 0) + normalizedDelta
  pointsDeltaByUserId.set(child.id, accumulatedDelta)
  debouncedUpdatePoints(child, accumulatedDelta)
}
</script>

<style scoped></style>
