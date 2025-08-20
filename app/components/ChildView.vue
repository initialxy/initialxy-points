<template>
  <div>
    <div class="max-w-100 mx-auto">
      <UCard class="mb-4" variant="subtle">
        <h1 class="text-3xl font-bold text-center mb-4">
          <span class="text-secondary">{{ user?.username }}</span>
          <span class="text-neutral-500"> earned</span>
        </h1>
        <div class="text-6xl font-extrabold text-primary text-center mb-4">
          {{ user?.points || 0 }}
          <span class="text-neutral-500 text-base absolute ml-2 mt-8">pts</span>
        </div>
        <p class="text-xl text-center text-neutral-500">
          <UIcon name="i-lucide-thumbs-up" />
          Keep it up!
        </p>
      </UCard>
    </div>

    <hr
      class="max-w-100 mx-auto bg-neutral-200 dark:bg-neutral-800 border-none h-px my-6"
    />

    <TaskList
      mode="child"
      :tasks="tasks?.tasks || []"
      @complete="handleCompleteTask"
      @reject="handleRejectTask"
    />
  </div>
</template>

<script setup lang="ts">
const { user: sessionUser } = useUserSession()
const user = sessionUser as Ref<User | null>

const { data: tasks } = await useFetch<TasksResponse>('/api/tasks', {
  query: {
    child_id: user.value?.id || 0,
  },
})

const toast = useToast()

// Handle complete event from TaskList component
const handleCompleteTask = async (task: Task) => {
  try {
    await $fetch(`/api/tasks/${task.id}/mark_complete`, {
      method: 'POST',
    })

    // Show success toast
    toast.add({
      title: 'Task marked as completed',
      color: 'success',
      progress: false,
    })

    // Refresh data to reflect changes
    await refreshNuxtData()
  } catch (error: any) {
    toast.add({
      title: 'Failed to mark task as completed',
      color: 'error',
      progress: false,
    })
  }
}

// Handle reject event from TaskList component
const handleRejectTask = async (task: Task) => {
  try {
    await $fetch(`/api/tasks/${task.id}/reject_complete`, {
      method: 'POST',
    })

    // Show success toast
    toast.add({
      title: 'Task marked as incomplete',
      color: 'success',
      progress: false,
    })

    // Refresh data to reflect changes
    await refreshNuxtData()
  } catch (error: any) {
    toast.add({
      title: 'Failed to mark task as incomplete',
      color: 'error',
      progress: false,
    })
  }
}
</script>

<style scoped></style>
