<template>
  <div>
    <h2>Child Dashboard</h2>
    <p>View your points, tasks, rewards, and wishlist items.</p>
    <div>
      <h3>Your Points</h3>
      <p v-if="user">{{ user.points }} points</p>
      <p v-else>Loading points...</p>
    </div>
    <div>
      <h3>Tasks</h3>
      <ul v-if="tasksData?.tasks.length ?? 0 > 0">
        <li v-for="task in tasksData?.tasks" :key="task.id">
          {{ task.points }} points - {{ task.description }}
          <span
            v-if="!task.is_marked_complete"
            @click="markTaskComplete(task.id)"
            style="cursor: pointer; color: blue"
            >Complete</span
          >
          <span v-else style="color: orange">(Completed - Awaiting Approval)</span>
        </li>
      </ul>
      <p v-else>No tasks available.</p>
    </div>
    <div>
      <h3>Rewards</h3>
      <ul v-if="rewardsData?.rewards.length ?? 0 > 0">
        <li v-for="reward in rewardsData?.rewards" :key="reward.id">
          {{ reward.points }} points - {{ reward.description }}
        </li>
      </ul>
      <p v-else>No rewards available.</p>
    </div>
    <div>
      <h3>Wishlist</h3>
      <ul v-if="wishlistData?.wishlist.length ?? 0 > 0">
        <li v-for="item in wishlistData?.wishlist" :key="item.id">
          {{ item.description }} - {{ item.points }} points
          <span v-if="item.status === 'pending'" style="color: orange">(Pending)</span>
          <span v-if="item.status === 'approved'" style="color: green">(Approved)</span>
          <span v-if="item.status === 'rejected'" style="color: red">(Rejected)</span>
        </li>
      </ul>
      <p v-else>Your wishlist is empty.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  TasksResponse,
  RewardsResponse,
  WishlistResponse,
  User,
} from '~/types'

const { user: sessionUser } = useUserSession()
const user = sessionUser as Ref<User | null>

const { data: tasksData, refresh: tasksRefresh } =
  await useFetch<TasksResponse>('/api/tasks')

const { data: rewardsData } = await useFetch<RewardsResponse>('/api/rewards')

const { data: wishlistData } = await useFetch<WishlistResponse>('/api/wishlist')

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

<style scoped>
h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
  text-align: center;
}

h3 {
  font-size: 1.25rem;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  color: #555;
}

p {
  font-size: 1.125rem;
  color: #333;
  margin-bottom: 1rem;
}

ul {
  list-style-type: none;
  padding: 0;
  max-width: 600px;
  margin: 0 auto;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  transition:
    background-color 0.3s,
    transform 0.2s;
}

li:hover {
  background-color: #e0f7fa;
  transform: translateX(5px);
}

.completed {
  text-decoration: line-through;
  color: #888;
}

.pending {
  color: orange;
}

.approved {
  color: green;
}

@media (max-width: 600px) {
  ul {
    padding: 0 1rem;
  }
}
</style>
