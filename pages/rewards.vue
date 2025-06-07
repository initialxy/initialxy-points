<template>
  <div>
    <h1>Manage Rewards</h1>
    <form @submit.prevent="createReward">
      <h2>Create New Reward</h2>
      <div>
        <label for="title">Title:</label>
        <input v-model="newReward.title" type="text" id="title" required />
      </div>
      <div>
        <label for="description">Description:</label>
        <input v-model="newReward.description" type="text" id="description" />
      </div>
      <div>
        <label for="points">Points:</label>
        <input v-model="newReward.points" type="number" id="points" required />
      </div>
      <button type="submit">Create Reward</button>
    </form>

    <h2>Available Rewards</h2>
    <div v-if="status === 'pending'">Loading...</div>
    <div v-else-if="error">{{ error.message }}</div>
    <ul v-else-if="data && data.length">
      <li v-for="reward in data" :key="reward.id">
        <h3>{{ reward.title }}</h3>
        <p>{{ reward.description }}</p>
        <p>Points: {{ reward.points }}</p>
      </li>
    </ul>
    <p v-else>No rewards available</p>
  </div>
</template>

<script setup lang="ts">
const newReward = ref({
  title: '',
  description: '',
  points: 0,
})
const { user, loggedIn, login, logout, isAuthenticated } = useAuth()

// Fetch rewards data using useFetch directly in setup
const { data, error, status } = await useFetch('/api/rewards')

const createReward = async () => {
  try {
    await $fetch('/api/rewards', {
      method: 'POST',
      body: newReward.value,
    })

    // Clear form and refresh rewards list
    newReward.value = { title: '', description: '', points: 0 }
    await refresh()
  } catch (err) {
    console.error('Error creating reward:', err)
  }
}
</script>

<style scoped>
h1,
h2,
h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

form div {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 2rem;
}

/* Responsive design */
@media (max-width: 768px) {
  h1,
  h2,
  h3 {
    font-size: 1.25rem;
  }

  p {
    font-size: 0.9rem;
  }

  input {
    padding: 0.4rem;
    font-size: 0.9rem;
  }

  button {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  h1,
  h2,
  h3 {
    font-size: 1rem;
  }

  p {
    font-size: 0.8rem;
  }

  input {
    padding: 0.3rem;
    font-size: 0.8rem;
  }

  button {
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
  }
}
</style>
