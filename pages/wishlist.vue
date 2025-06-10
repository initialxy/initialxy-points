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
        <label for="description">Description:</label>
        <input v-model="description" type="text" id="description" required />
      </div>
      <button type="submit">Add to Wishlist</button>
    </form>

    <h2>Wishlist Items</h2>
    <ul v-if="data && data.wishlist.length">
      <li v-for="item in data.wishlist" :key="item.id">
        <h3>{{ item.description }}</h3>
        <p>Status: {{ item.status }}</p>
        <p v-if="item.status === 'pending'">
          <button @click="approveItem(item.id)">Approve</button>
          <button @click="rejectItem(item.id)">Reject</button>
        </p>
        <p v-if="item.status === 'approved'">Points: {{ item.points }}</p>
      </li>
    </ul>
    <p v-else-if="status === 'pending'">Loading...</p>
    <p v-else-if="error">{{ error.message }}</p>
    <p v-else>No wishlist items</p>
  </div>
</template>

<script setup lang="ts">
import type { WishlistResponse, Notification, WishlistItem } from '~/types'
import { ref } from 'vue'
import { useFetch } from '#imports'

const description = ref('')
const notification = ref<Notification | null>(null)
const points = ref(0)

type WishlistData = {
  wishlist: WishlistItem[]
}

// Fetch wishlist data using useFetch directly in setup
const { data, error, status, refresh } =
  await useFetch<WishlistResponse>('/api/wishlist')

const addToWishlist = async () => {
  try {
    await $fetch('/api/wishlist', {
      method: 'POST',
      body: { description: description.value },
    })

    // Clear input and refresh wishlist
    description.value = ''
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

const approveItem = async (id: number) => {
  try {
    await $fetch(`/api/wishlist/${id}/approve`, {
      method: 'POST',
      body: { points: points.value },
    })
    await refresh()
    notification.value = {
      message: 'Item approved successfully!',
      type: 'success',
    }
  } catch (err) {
    console.error('Error approving item:', err)
    notification.value = {
      message: 'Failed to approve item. Please try again.',
      type: 'error',
    }
  }
}

const rejectItem = async (id: number) => {
  try {
    await $fetch(`/api/wishlist/${id}/reject`, {
      method: 'POST',
    })
    await refresh()
    notification.value = {
      message: 'Item rejected successfully!',
      type: 'success',
    }
  } catch (err) {
    console.error('Error rejecting item:', err)
    notification.value = {
      message: 'Failed to reject item. Please try again.',
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
