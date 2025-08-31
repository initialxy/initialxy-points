<template>
  <div>
    <div class="max-w-150 mx-auto">
      <UCard class="mb-4" variant="subtle" data-testid="child-points-card">
        <h1 class="text-3xl font-bold text-center mb-4">
          <span class="text-secondary">{{ user?.username }}</span>
          <span class="text-neutral-500"> earned</span>
        </h1>
        <div
          class="text-6xl font-extrabold text-primary text-center mb-4"
          data-testid="child-points-display"
        >
          {{ userData?.user?.points || 0 }}
          <span class="text-neutral-500 text-base absolute ml-2 mt-8">pts</span>
        </div>
        <div class="text-xl text-center text-neutral-500 space-x-2">
          <p class="inline-flex items-center space-x-1">
            <UIcon name="i-lucide-rocket" />
            <span>Keep it up!</span>
          </p>
        </div>
      </UCard>
    </div>

    <hr
      class="max-w-150 mx-auto bg-neutral-200 dark:bg-neutral-800 border-none h-px my-6"
    />

    <TaskList
      mode="child"
      :tasks="tasks?.tasks || []"
      @complete="handleCompleteTask"
      @reject="handleRejectTask"
    />

    <hr
      class="max-w-150 mx-auto bg-neutral-200 dark:bg-neutral-800 border-none h-px my-6"
    />

    <RewardList
      :rewards="rewards?.rewards || []"
      mode="child"
      @complete="handleCompleteReward"
      @reject="handleRejectReward"
    />
  </div>
</template>

<script setup lang="ts">
const { user: sessionUser } = useUserSession()
const user = sessionUser as Ref<User | null>

const { data: userData } = await useLazyFetch<UserResponse>(
  `/api/users/${user.value?.id || 0}`
)

const { data: tasks } = await useLazyFetch<TasksResponse>('/api/tasks', {
  query: {
    child_id: user.value?.id || 0,
  },
})

const { data: rewards } = await useLazyFetch<RewardsResponse>('/api/rewards', {
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

// Handle reward redemption request from child
const handleCompleteReward = async (reward: Reward) => {
  // Check if user has enough points for the reward
  if ((userData.value?.user?.points || 0) < reward.points) {
    toast.add({
      title: 'Not enough points',
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
    toast.add({
      title: 'Failed to request reward redemption',
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
      title: 'Reward redemption cancelled',
      color: 'success',
      progress: false,
    })

    // Refresh data to reflect changes
    await refreshNuxtData()
  } catch (error: any) {
    toast.add({
      title: 'Failed to cancel reward redemption',
      color: 'error',
      progress: false,
    })
  }
}
</script>

<style scoped></style>
