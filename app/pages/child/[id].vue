<template>
  <div>
    <div class="max-w-150 mx-auto">
      <UCard class="mb-4" variant="subtle">
        <h1 class="text-3xl font-bold text-center mb-4">
          <span class="text-secondary">{{ child?.user?.username }}</span>
          <span class="text-neutral-500"> earned</span>
        </h1>
        <div class="text-6xl font-extrabold text-primary text-center mb-4">
          {{ child?.user?.points || 0 }}
          <span class="text-neutral-500 text-base absolute ml-2 mt-8">pts</span>
        </div>
        <div class="text-xl text-center text-neutral-500 space-x-2">
          <UBadge
            v-if="getPendingTasksCount() > 0"
            variant="subtle"
            size="xl"
            icon="i-lucide-clipboard-list"
            class="ring-cyan-200 dark:ring-cyan-800/50 bg-cyan-200/20 dark:bg-cyan-800/20 text-cyan-700 dark:text-cyan-200"
          >
            {{ getPendingTasksCount() }}
          </UBadge>
          <UBadge
            v-if="getPendingRewardsCount() > 0"
            variant="subtle"
            size="xl"
            icon="i-lucide-gift"
            class="ring-indigo-200 dark:ring-indigo-800/50 bg-indigo-200/20 dark:bg-indigo-800/20 text-indigo-700 dark:text-indigo-200"
          >
            {{ getPendingRewardsCount() }}
          </UBadge>
          <p
            v-if="
              getPendingRewardsCount() === 0 && getPendingTasksCount() === 0
            "
            class="inline-flex items-center space-x-1"
          >
            <UIcon name="i-lucide-smile" />
            <span>All good!</span>
          </p>
        </div>
      </UCard>
    </div>

    <hr
      class="max-w-150 mx-auto bg-neutral-200 dark:bg-neutral-800 border-none h-px my-6"
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
      class="max-w-150 mx-auto bg-neutral-200 dark:bg-neutral-800 border-none h-px my-6"
    />

    <RewardList
      :rewards="rewards?.rewards || []"
      mode="parent"
      @complete="handleCompleteReward"
      @edit="handleEditReward"
      @reject="handleRejectReward"
      @delete="handleDeleteReward"
    />

    <hr
      class="max-w-150 mx-auto bg-neutral-200 dark:bg-neutral-800 border-none h-px my-6"
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

    <!-- Edit Reward Modal -->
    <ActionEntityModal
      v-model:open="showEditRewardModal"
      v-model:actionItem="editRewardState"
      title="Edit Reward"
      submit-button-text="Update"
      @submit="editRewardSubmit"
    />
  </div>
</template>

<script setup lang="ts">
const MAX_LOG_LIMIT = 20

const route = useRoute()
const store = useStore()
const toast = useToast()
const childId = route.params.id

const { data: child } = await useLazyFetch<UserResponse>(
  `/api/users/${childId}`
)
const { data: tasks } = await useLazyFetch<TasksResponse>('/api/tasks', {
  query: {
    child_id: childId,
  },
})

const { data: logs } = await useLazyFetch<LogsResponse>('/api/logs', {
  query: {
    limit: MAX_LOG_LIMIT,
    recipient_id: childId,
  },
})

const { data: rewards } = await useLazyFetch<RewardsResponse>('/api/rewards', {
  query: {
    child_id: childId,
  },
})

watch(child, (loadedChild) => {
  store.actionableUser = loadedChild?.user || null
})

onMounted(() => {
  store.actionableUser = child.value?.user || null
})

onUnmounted(() => {
  store.actionableUser = null
})

const getPendingTasksCount = () =>
  (tasks.value?.tasks || []).filter((task) => task.is_marked_complete).length

const getPendingRewardsCount = () =>
  (rewards.value?.rewards || []).filter(
    (reward) => reward.is_redemption_requested
  ).length

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

// Approve redemption request from child
const handleCompleteReward = async (reward: Reward) => {
  // Check if the child has enough points before allowing redemption
  if (
    child.value &&
    child.value.user &&
    child.value.user.points < reward.points
  ) {
    toast.add({
      title: 'Not enough points',
      color: 'error',
      progress: false,
    })
    return
  }

  try {
    await $fetch(`/api/rewards/${reward.id}/approve_redemption`, {
      method: 'POST',
    })

    // Show success toast
    toast.add({
      title: 'Reward redemption approved',
      color: 'success',
      progress: false,
    })

    // Refresh data to reflect changes
    await refreshNuxtData()
  } catch (error: any) {
    toast.add({
      title: 'Failed to approve reward redemption',
      color: 'error',
      progress: false,
    })
  }
}

// Edit reward modal state
const showEditRewardModal = ref(false)
const editingReward = ref<Reward | null>(null)

// Form state for editing reward
const editRewardState: Ref<PartialActionItem> = ref({
  description: '',
  points: null,
  recurrenceType: 'single-use',
})

// Handle edit event from RewardList component
const handleEditReward = (reward: Reward) => {
  editingReward.value = reward
  editRewardState.value = {
    description: reward.description,
    points: reward.points,
    recurrenceType: reward.recurrence_type,
  }
  showEditRewardModal.value = true
}

// Submit edited reward
const editRewardSubmit = async () => {
  if (!editingReward.value) {
    return
  }

  try {
    await $fetch(`/api/rewards/${editingReward.value.id}`, {
      method: 'PUT',
      body: {
        description: editRewardState.value.description,
        points: editRewardState.value.points || 0,
        recurrence_type: editRewardState.value.recurrenceType,
      },
    })

    // Show success toast
    toast.add({
      title: 'Reward updated successfully',
      color: 'success',
      progress: false,
    })

    // Close modal and reset form
    showEditRewardModal.value = false
    editingReward.value = null

    // Refresh data to reflect changes
    await refreshNuxtData()
  } catch (error: any) {
    toast.add({
      title: 'Failed to update reward',
      color: 'error',
      progress: false,
    })
  }
}

// Handle reject event from RewardList component
const handleRejectReward = async (reward: Reward) => {
  try {
    await $fetch(`/api/rewards/${reward.id}/reject_redemption`, {
      method: 'POST',
    })

    // Show success toast
    toast.add({
      title: 'Reward redemption rejected',
      color: 'success',
      progress: false,
    })

    // Refresh data to reflect changes
    await refreshNuxtData()
  } catch (error: any) {
    toast.add({
      title: 'Failed to reject reward redemption',
      color: 'error',
      progress: false,
    })
  }
}

// Handle delete event from RewardList component
const handleDeleteReward = async (reward: Reward) => {
  try {
    await $fetch(`/api/rewards/${reward.id}`, {
      method: 'DELETE',
    })

    // Show success toast
    toast.add({
      title: 'Reward deleted successfully',
      color: 'success',
      progress: false,
    })

    // Refresh data to reflect changes
    await refreshNuxtData()
  } catch (error: any) {
    toast.add({
      title: 'Failed to delete reward',
      color: 'error',
      progress: false,
    })
  }
}
</script>
