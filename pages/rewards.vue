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
    <ul v-if="rewards.length">
      <li v-for="reward in rewards" :key="reward.id">
        <h3>{{ reward.title }}</h3>
        <p>{{ reward.description }}</p>
        <p>Points: {{ reward.points }}</p>
      </li>
    </ul>
    <p v-else>No rewards available</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useFetch } from '#app'

const rewards = ref([])
const newReward = ref({
  title: '',
  description: '',
  points: 0,
})
const authStore = useAuthStore()

onMounted(async () => {
  const { data, error } = await useFetch('/api/rewards', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authStore.user.token}`,
    },
  })

  if (error.value) {
    console.error('Error fetching rewards:', error.value)
    return
  }

  rewards.value = data.value
})

const createReward = async () => {
  const { error } = await useFetch('/api/rewards', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authStore.user.token}`,
    },
    body: newReward.value,
  })

  if (error.value) {
    console.error('Error creating reward:', error.value)
    return
  }

  // Clear form and refresh rewards list
  newReward.value = { title: '', description: '', points: 0 }
  const { data } = await useFetch('/api/rewards', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authStore.user.token}`,
    },
  })
  rewards.value = data.value
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
