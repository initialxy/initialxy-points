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
          <UBadge variant="subtle" size="xl" icon="i-lucide-bell-ring">
            <UIcon name="i-lucide-clipboard-list" />
            {{ getPendingTasksCount() }}
          </UBadge>
        </p>
      </UCard>
    </div>

    <hr
      class="max-w-100 mx-auto bg-neutral-200 dark:bg-neutral-800 border-none h-px my-6"
    />

    <TaskList
      mode="parent"
      :tasks="tasks?.tasks || []"
      @edit="handleEditTask"
      @complete="handleCompleteTask"
      @reject="handleRejectTask"
      @delete="handleDeleteTask"
    />

    <hr
      class="max-w-100 mx-auto bg-neutral-200 dark:bg-neutral-800 border-none h-px my-6"
    />

    <LogList :logs="logs?.logs || []" />

    <!-- Edit Task Modal -->
    <TaskModal
      v-model:open="showEditTaskModal"
      v-model:task="editTaskState"
      title="Edit Task"
      submit-button-text="Update"
      @submit="editTaskSubmit"
    />
  </div>
</template>

<script setup lang="ts">
const MAX_LOG_LIMIT = 20

const route = useRoute()
const store = useStore()
const toast = useToast()
const childId = route.params.id

const { data: child } = await useFetch<UserResponse>(`/api/users/${childId}`)
const { data: tasks } = await useFetch<TasksResponse>('/api/tasks', {
  query: {
    child_id: childId,
  },
})

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
  if (!tasks.value?.tasks) {
    return 0
  }
  return tasks.value.tasks.filter((task) => task.is_marked_complete).length
}

// Edit task modal state
const showEditTaskModal = ref(false)
const editingTask = ref<Task | null>(null)

// Form state for editing
const editTaskState: Ref<PartialTask> = ref({
  description: '',
  points: null,
  taskType: 'throw-away',
})

// Handle edit event from TaskList component
const handleEditTask = (task: Task) => {
  editingTask.value = task
  editTaskState.value = {
    description: task.description,
    points: task.points,
    taskType: task.task_type,
  }
  showEditTaskModal.value = true
}

// Handle complete event from TaskList component
const handleCompleteTask = async (task: Task) => {
  try {
    await $fetch(`/api/tasks/${task.id}/approve_complete`, {
      method: 'POST',
    })

    // Show success toast
    toast.add({
      title: 'Task completion approved',
      color: 'success',
      progress: false,
    })

    // Refresh data to reflect changes
    await refreshNuxtData()
  } catch (error: any) {
    toast.add({
      title: 'Failed to approve task completion',
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
      title: 'Task completion rejected',
      color: 'success',
      progress: false,
    })

    // Refresh data to reflect changes
    await refreshNuxtData()
  } catch (error: any) {
    toast.add({
      title: 'Failed to reject task completion',
      color: 'error',
      progress: false,
    })
  }
}

// Handle delete event from TaskList component
const handleDeleteTask = async (task: Task) => {
  try {
    await $fetch(`/api/tasks/${task.id}`, {
      method: 'DELETE',
    })

    // Show success toast
    toast.add({
      title: 'Task deleted successfully',
      color: 'success',
      progress: false,
    })

    // Refresh data to reflect changes
    await refreshNuxtData()
  } catch (error: any) {
    toast.add({
      title: 'Failed to delete task',
      color: 'error',
      progress: false,
    })
  }
}

// Submit edited task
const editTaskSubmit = async () => {
  if (!editingTask.value) {
    return
  }

  try {
    await $fetch(`/api/tasks/${editingTask.value.id}`, {
      method: 'PUT',
      body: {
        description: editTaskState.value.description,
        points: editTaskState.value.points || 0,
        task_type: editTaskState.value.taskType,
      },
    })

    // Show success toast
    toast.add({
      title: 'Task updated successfully',
      color: 'success',
      progress: false,
    })

    // Close modal and reset form
    showEditTaskModal.value = false
    editingTask.value = null

    // Refresh data to reflect changes
    await refreshNuxtData()
  } catch (error: any) {
    toast.add({
      title: 'Failed to update task',
      color: 'error',
      progress: false,
    })
  }
}
</script>
