<template>
  <div v-if="childrenData?.users.length ?? 0 > 0" class="max-w-100 mx-auto">
    <UCard
      v-for="child in childrenData?.users"
      :key="child.id"
      class="mb-4"
      variant="subtle"
      @click="navigateTo(`/child/${child.id}`)"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold grow text-nowrap text-ellipsis">
          {{ child.username }}
        </h2>
        <UBadge
          variant="subtle"
          size="xl"
          icon="i-lucide-bell-ring"
          class="mx-2"
        >
          {{ getPendingTasksCount(child.id) }}
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

const emit = defineEmits(['updatePoints', 'submit'])

const toast = useToast()

const { data: childrenData, refresh } = await useFetch<UsersResponse>(
  '/api/users',
  {
    query: { role: 'child' },
  }
)

const { data: tasksData } = await useFetch<TasksResponse>('/api/tasks')

const getPendingTasksCount = (childId: number) => {
  if (!tasksData.value?.tasks) return 0
  return tasksData.value.tasks.filter(
    (task) => task.child_id === childId && task.is_marked_complete
  ).length
}

const debouncedUpdatePoints = debounce(
  async (childId: number, newPoints: number) => {
    try {
      await $fetch(`/api/users/${childId}/points`, {
        method: 'PUT',
        body: { points: newPoints },
      })
      await refresh()

      emit('updatePoints', { childId, points: newPoints })
    } catch (err) {
      console.error('Error updating points:', err)
      toast.add({ title: 'Failed to update points', progress: false })
    }
  },
  DEBOUNCE_WAIT_MS
)

const changePoints = async (child: User, delta: number, event: Event) => {
  event.stopPropagation()
  const updatedPoints = Math.max((child.points || 0) + delta, 0)
  child.points = updatedPoints

  debouncedUpdatePoints(child.id, updatedPoints)
}
</script>

<style scoped></style>
