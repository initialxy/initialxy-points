<template>
  <div v-if="childrenData?.users.length ?? 0 > 0" class="max-w-150 mx-auto">
    <UCard
      v-for="child in childrenData?.users"
      :key="child.id"
      class="mb-4 clickable-lg"
      variant="subtle"
      data-testid="child-card"
      @click="navigateTo(`/child/${child.id}`)"
    >
      <div class="flex items-center justify-start">
        <h2
          class="text-xl font-semibold grow min-w-0 truncate"
          data-testid="child-username"
        >
          {{ child.username }}
        </h2>
        <UBadge
          v-if="getNotificationsCount(child.id) > 0"
          variant="subtle"
          size="xl"
          icon="i-lucide-bell-ring"
          class="mx-2 py-2"
          data-testid="child-notification-badge"
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
            data-testid="child-points-decrease"
            @click="changePoints(child, -1, $event)"
          />
          <UInput
            :model-value="child.points"
            type="number"
            variant="none"
            class="w-15 m-0"
            size="xl"
            :ui="{ base: 'text-center' }"
            data-testid="child-points-input"
            @update:model-value="(value) => onPointsInput(child, value)"
            @click="$event.stopPropagation()"
          />
          <UButton
            icon="i-lucide-plus"
            color="success"
            variant="soft"
            size="xl"
            class="ml-0 touch-manipulation"
            data-testid="child-points-increase"
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

// Keep track of the pending points change per child, because the API requires a
// points_change (delta) instead of a raw points value to be more race condition
// resistant.
const pointsDeltaByUserId = new Map<number, number>()

// One debounced updater per child, so rapid changes on different children are
// each flushed instead of cancelling each other out.
const pointsUpdateByUserId = new Map<
  number,
  (userId: number, delta: number) => void
>()

const schedulePointsUpdate = (child: User, pendingDelta: number) => {
  let send = pointsUpdateByUserId.get(child.id)
  if (!send) {
    send = debounce(async (userId: number, delta: number) => {
      try {
        await $fetch(`/api/users/${userId}/points`, {
          method: 'PUT',
          body: { points_change: delta },
        })
        pointsDeltaByUserId.delete(userId)
        await refresh()
        const refreshedChild = childrenData.value?.users.find(
          (user) => user.id === userId
        )
        emit('updatePoints', {
          childId: userId,
          points: refreshedChild?.points ?? 0,
        })
      } catch (err) {
        console.error('Error updating points:', err)
        toast.add({
          title: getApiErrorMessage(err),
          progress: false,
          color: 'error',
        })
      } finally {
        pointsUpdateByUserId.delete(userId)
      }
    }, DEBOUNCE_WAIT_MS)
    pointsUpdateByUserId.set(child.id, send)
  }
  send(child.id, pendingDelta)
}

const getNotificationsCount = (childId: number) => {
  // Sum tasks and rewards that's awaiting parental approval
  const tasksCount = (tasksData.value?.tasks || []).filter(
    (task) => task.child_id === childId && task.is_marked_complete
  ).length

  const rewardsCount = (rewardsData.value?.rewards || []).filter(
    (reward) => reward.child_id === childId && reward.is_redemption_requested
  ).length

  return tasksCount + rewardsCount
}

// Update points from a direct input: the value typed is an absolute points
// value, so translate it to a delta against the last server-confirmed value.
const onPointsInput = (child: User, newValue: number | string | null) => {
  const newPoints = Math.max(Math.trunc(Number(newValue)) || 0, 0)
  if (newPoints === (child.points ?? 0)) {
    return
  }

  const pendingDelta = pointsDeltaByUserId.get(child.id) || 0
  const serverPoints = (child.points ?? 0) - pendingDelta
  const newPendingDelta = newPoints - serverPoints

  child.points = newPoints
  pointsDeltaByUserId.set(child.id, newPendingDelta)
  schedulePointsUpdate(child, newPendingDelta)
}

const changePoints = (child: User, delta: number, event: Event) => {
  event.stopPropagation()
  const updatedPoints = Math.max((child.points ?? 0) + delta, 0)
  const normalizedDelta = updatedPoints - (child.points ?? 0)
  child.points = updatedPoints

  const newPendingDelta =
    (pointsDeltaByUserId.get(child.id) || 0) + normalizedDelta
  pointsDeltaByUserId.set(child.id, newPendingDelta)
  schedulePointsUpdate(child, newPendingDelta)
}
</script>

<style scoped></style>
