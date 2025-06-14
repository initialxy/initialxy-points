<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Child Dashboard</h2>
    <p class="mb-6">View your points, tasks, and rewards.</p>

    <UCard class="mb-8">
      <template #header>
        <h3 class="text-xl font-semibold">Your Points</h3>
      </template>
      <template #default>
        <p v-if="user">{{ user.points }} points</p>
        <p v-else class="text-gray-500">Loading points...</p>
      </template>
    </UCard>

    <UCard class="mb-8">
      <template #header>
        <h3 class="text-xl font-semibold">Tasks</h3>
      </template>
      <template #default>
        <ul v-if="tasksData?.tasks.length ?? 0 > 0" class="space-y-4">
          <li
            v-for="task in tasksData?.tasks"
            :key="task.id"
            class="p-4 bg-gray-100 rounded-lg shadow-sm"
          >
            <div class="font-semibold">
              {{ task.points }} points - {{ task.description }}
            </div>
            <span
              v-if="!task.is_marked_complete"
              class="text-blue-500 cursor-pointer"
              @click="markTaskComplete(task.id)"
              >Complete</span
            >
            <span v-else class="text-orange-500"
              >(Completed - Awaiting Approval)</span
            >
          </li>
        </ul>
        <p v-else class="text-gray-500">No tasks available.</p>
      </template>
    </UCard>

    <UCard class="mb-8">
      <template #header>
        <h3 class="text-xl font-semibold">Rewards</h3>
      </template>
      <template #default>
        <ul v-if="rewardsData?.rewards.length ?? 0 > 0" class="space-y-4">
          <li
            v-for="reward in rewardsData?.rewards"
            :key="reward.id"
            class="p-4 bg-gray-100 rounded-lg shadow-sm"
          >
            <div class="font-semibold">
              {{ reward.points }} points - {{ reward.description }}
            </div>
          </li>
        </ul>
        <p v-else class="text-gray-500">No rewards available.</p>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { user: sessionUser } = useUserSession()
const user = sessionUser as Ref<User | null>

const { data: tasksData, refresh: tasksRefresh } =
  await useFetch<TasksResponse>('/api/tasks')

const { data: rewardsData } = await useFetch<RewardsResponse>('/api/rewards')

const markTaskComplete = async (taskId: number) => {
  try {
    await $fetch(`/api/tasks/${taskId}/mark_complete`, {
      method: 'POST',
    })
    await tasksRefresh()
  } catch (err) {
    console.error('Error completing task:', err)
  }
}
</script>

<style scoped></style>
