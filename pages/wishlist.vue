<template>
  <div>
    <h1>My Wishlist</h1>
    <Notification
      v-if="notification"
      :message="notification.message"
      :type="notification.type"
    />
    <form @submit.prevent="addToWishlist">
      <h2>Add to Wishlist</h2>
      <div>
        <label for="rewardId">Reward ID:</label>
        <input v-model="rewardId" type="number" id="rewardId" required />
      </div>
      <button type="submit">Add to Wishlist</button>
    </form>

    <h2>Wishlist Items</h2>
    <ul v-if="data && data.length">
      <li v-for="item in data" :key="item.id">
        <h3>{{ item.reward.title }}</h3>
        <p>{{ item.reward.description }}</p>
        <p>Points: {{ item.reward.points }}</p>
        <p>Status: {{ item.approved ? 'Approved' : 'Pending' }}</p>
      </li>
    </ul>
    <p v-else-if="status === 'pending'">Loading...</p>
    <p v-else-if="error">{{ error.message }}</p>
    <p v-else>No wishlist items</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useFetch } from '#app'
import Notification from '@/components/Notification.vue'

const rewardId = ref(0)
const { user, loggedIn, login, logout, isAuthenticated } = useAuth()
const notification = ref(null)

// Fetch wishlist data using useFetch directly in setup
const { data, error, status, refresh } = await useFetch('/api/wishlist')

const addToWishlist = async () => {
  try {
    await $fetch('/api/wishlist', {
      method: 'POST',
      body: { rewardId: rewardId.value },
    })

    // Clear input and refresh wishlist
    rewardId.value = 0
    await refresh()

    // Show notification
    notification.value = {
      message: 'Item added to wishlist successfully!',
      type: 'success',
    }

    // Clear notification after 3 seconds
    setTimeout(() => {
      notification.value = null
    }, 3000)
  } catch (err) {
    console.error('Error adding to wishlist:', err)
    notification.value = {
      message: 'Failed to add to wishlist. Please try again.',
      type: 'error',
    }
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
    font-size: 1.2rem;
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
