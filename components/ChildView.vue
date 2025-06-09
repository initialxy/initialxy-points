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
      <ul v-if="tasksData?.tasks && tasksData.tasks.length > 0">
        <li v-for="task in tasksData.tasks" :key="task.id">
          {{ task.title }} - {{ task.points }} points
          <span
            v-if="!task.completed"
            @click="completeTask(task.id)"
            style="cursor: pointer; color: blue"
            >Complete</span
          >
          <span v-else>(Completed)</span>
        </li>
      </ul>
      <p v-else>No tasks available.</p>
    </div>
    <div>
      <h3>Rewards</h3>
      <ul v-if="rewardsData?.rewards && rewardsData.rewards.length > 0">
        <li v-for="reward in rewardsData.rewards" :key="reward.id">
          {{ reward.title }} - {{ reward.points }} points
        </li>
      </ul>
      <p v-else>No rewards available.</p>
    </div>
    <div>
      <h3>Wishlist</h3>
      <ul v-if="wishlistData?.wishlist && wishlistData.wishlist.length > 0">
        <li v-for="item in wishlistData.wishlist" :key="item.id">
          {{ item.reward_title }} - {{ item.reward_points }} points
          <span v-if="!item.approved" style="color: orange">(Pending)</span>
          <span v-else style="color: green">(Approved)</span>
        </li>
      </ul>
      <p v-else>Your wishlist is empty.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = useUserSession()

// Fetch tasks using useFetch (reactive)
const {
  data: tasksData,
  pending: tasksPending,
  error: tasksError,
} = await useFetch('/api/tasks')

// Fetch rewards using useFetch (reactive)
const {
  data: rewardsData,
  pending: rewardsPending,
  error: rewardsError,
} = await useFetch('/api/rewards')

// Fetch wishlist using useFetch (reactive)
const {
  data: wishlistData,
  pending: wishlistPending,
  error: wishlistError,
} = await useFetch('/api/wishlist')

const completeTask = async (taskId: number) => {
  try {
    await $fetch(`/api/tasks/${taskId}/complete`, {
      method: 'POST',
    })
    // Update local tasks list
    const taskIndex = tasksData.value.tasks.findIndex((t) => t.id === taskId)
    if (taskIndex !== -1) {
      tasksData.value.tasks[taskIndex].completed = true
    }
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
