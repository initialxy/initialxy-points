<template>
  <div>
    <div class="max-w-100 mx-auto">
      <UCard class="mb-4" variant="subtle">
        <h1 class="text-3xl font-bold text-center mb-4">
          <span class="text-secondary">{{ child?.user?.username }}</span>
          <span class="text-neutral-500"> earned</span>
        </h1>
        <div class="text-6xl font-extrabold text-primary text-center mb-4">
          {{ child?.user?.points || 0 }}
          <span class="text-neutral-500 text-base absolute ml-2 mt-8">pts</span>
        </div>
        <p class="text-xl text-center text-neutral-500">
          <UBadge
            variant="subtle"
            size="xl"
            icon="i-lucide-clipboard-list"
            class="ring-cyan-200 dark:ring-cyan-800 bg-cyan-200/20 dark:bg-cyan-800/20 text-cyan-500"
          >
            {{ getPendingTasksCount() }}
          </UBadge>
        </p>
      </UCard>
    </div>

    <hr
      class="max-w-100 mx-auto bg-neutral-200 dark:bg-neutral-800 border-none h-px my-6"
    />

    <TaskList :tasks="tasks?.tasks || []" />

    <hr
      class="max-w-100 mx-auto bg-neutral-200 dark:bg-neutral-800 border-none h-px my-6"
    />

    <LogList :logs="logs?.logs || []" />
  </div>
</template>

<script setup lang="ts">
const MAX_LOG_LIMIT = 20

const route = useRoute()
const store = useStore()
const childId = route.params.id

const { data: child } = await useFetch<UserResponse>(`/api/users/${childId}`)
const { data: tasks } = await useFetch<TasksResponse>('/api/tasks')
const { data: logs } = await useFetch<LogsResponse>('/api/logs', {
  query: {
    limit: MAX_LOG_LIMIT,
    recipient_id: childId,
  },
})

onMounted(() => {
  store.actionableUser = child.value?.user || null
})

onUnmounted(() => {
  store.actionableUser = null
})

const getPendingTasksCount = () => {
  if (!tasks.value?.tasks) return 0
  return tasks.value.tasks.filter((task) => task.is_marked_complete).length
}
</script>
