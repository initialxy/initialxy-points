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

    <RewardList
      :rewards="rewards?.rewards || []"
      mode="parent"
      @request-redemption="handleRequestRedemption"
    />

    <hr
      class="max-w-100 mx-auto bg-neutral-200 dark:bg-neutral-800 border-none h-px my-6"
    />

    <LogList :logs="logs?.logs || []" />

    <!-- Edit Task Modal -->
    <ActionEntityModal
      v-model:open="showEditTaskModal"
      v-model:actionItem="editTaskState"
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

const { data: rewards } = await useFetch<RewardsResponse>('/api/rewards', {
  query: {
    child_id: childId,
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
const editTaskState: Ref<PartialActionItem> = ref({
  description: '',
  points: null,
  recurrenceType: 'single-use',
})

// Handle edit event from TaskList component
const handleEditTask = (task: Task) => {
  editingTask.value = task
  editTaskState.value = {
    description: task.description,
    points: task.points,
    recurrenceType: task.recurrence_type,
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
        recurrence_type: editTaskState.value.recurrenceType,
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

// Handle reward redemption request from child
const handleRequestRedemption = async (reward: Reward) => {
  // Check if the child has enough points before allowing redemption
  if (child.value && child.value.user && child.value.user.points < reward.points) {
    toast.add({
      title: 'Not enough points',
      description: `Child needs ${reward.points} points to redeem this reward, but they only have ${child.value.user.points}`,
      color: 'error',
      progress: false,
    })
    return
  }

  try {
    await $fetch(`/api/rewards/${reward.id}/request_redemption`, {
      method: 'POST',
    })

    // Show success toast
    toast.add({
      title: 'Reward redemption requested',
      color: 'success',
      progress: false,
    })

    // Refresh data to reflect changes
    await refreshNuxtData()
  } catch (error: any) {
    // Handle specific error for insufficient points
    if (error.data?.message && error.data.message.includes('enough points')) {
      toast.add({
        title: 'Not enough points',
        description: error.data.message +
          (error.data.requiredPoints ? ` Required: ${error.data.requiredPoints}, Available: ${error.data.availablePoints}` : ''),
        color: 'error',
        progress: false,
      })
    } else {
      toast.add({
        title: 'Failed to request reward redemption',
        color: 'error',
        progress: false,
      })
    }
  }
}
</script>
