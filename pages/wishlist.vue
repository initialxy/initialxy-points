<template>
  <UContainer>
    <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">My Wishlist</h1>

    <UCard class="mb-8">
      <template #header>
        <h2 class="text-xl font-semibold">Add to Wishlist</h2>
      </template>
      <UForm
        :schema="wishlistSchema"
        :state="description"
        class="space-y-4"
        @submit="addToWishlist"
      >
        <UFormField label="Description" name="description">
          <UInput v-model="description" class="w-full" />
        </UFormField>
        <UButton type="submit" color="primary" :disabled="isLoading">
          Add to Wishlist
        </UButton>
      </UForm>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">Wishlist Items</h2>
      </template>
      <template #default>
        <ul v-if="data?.wishlist.length ?? 0 > 0" class="space-y-4">
          <li
            v-for="item in data.wishlist"
            :key="item.id"
            class="p-4 bg-gray-100 rounded-lg shadow-sm"
          >
            <h3 class="font-semibold">{{ item.description }}</h3>
            <p>Status: {{ item.status }}</p>
            <p v-if="item.status === 'pending'" class="mt-2 space-x-2">
              <UButton size="sm" @click="approveItem(item.id)">Approve</UButton>
              <UButton size="sm" color="error" @click="rejectItem(item.id)"
                >Reject</UButton
              >
            </p>
            <p v-if="item.status === 'approved'" class="mt-2">
              Points: {{ item.points }}
            </p>
          </li>
        </ul>
        <p v-else-if="status === 'pending'" class="text-gray-500">Loading...</p>
        <p v-else-if="error" class="text-red-500">{{ error.message }}</p>
        <p v-else class="text-gray-500">No wishlist items</p>
      </template>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import type { WishlistResponse, WishlistItem } from '~/types'
import { ref } from 'vue'
import { useFetch } from '#imports'
import * as z from 'zod'
import { useToast } from '#imports'

const toast = useToast()

const description = ref('')
const points = ref(0)
const isLoading = ref(false)

type WishlistData = {
  wishlist: WishlistItem[]
}

// Fetch wishlist data using useFetch directly in setup
const { data, error, status, refresh } =
  await useFetch<WishlistResponse>('/api/wishlist')

const wishlistSchema = z.object({
  description: z.string().min(1, 'Description is required'),
})

const addToWishlist = async () => {
  isLoading.value = true

  try {
    await $fetch('/api/wishlist', {
      method: 'POST',
      body: { description: description.value },
    })

    // Clear input and refresh wishlist
    description.value = ''
    await refresh()

    // Show toast
    toast.add({
      title: 'Item added to wishlist successfully!',
      color: 'success',
    })
  } catch (err) {
    console.error('Error adding to wishlist:', err)
    toast.add({
      title: 'Failed to add to wishlist. Please try again.',
      color: 'error',
    })
  } finally {
    isLoading.value = false
  }
}

const approveItem = async (id: number) => {
  isLoading.value = true

  try {
    await $fetch(`/api/wishlist/${id}/approve`, {
      method: 'POST',
      body: { points: points.value },
    })
    await refresh()
    toast.add({
      title: 'Item approved successfully!',
      color: 'success',
    })
  } catch (err) {
    console.error('Error approving item:', err)
    toast.add({
      title: 'Failed to approve item. Please try again.',
      color: 'error',
    })
  } finally {
    isLoading.value = false
  }
}

const rejectItem = async (id: number) => {
  isLoading.value = true

  try {
    await $fetch(`/api/wishlist/${id}/reject`, {
      method: 'POST',
    })
    await refresh()
    toast.add({
      title: 'Item rejected successfully!',
      color: 'success',
    })
  } catch (err) {
    console.error('Error rejecting item:', err)
    toast.add({
      title: 'Failed to reject item. Please try again.',
      color: 'error',
    })
  } finally {
    isLoading.value = false
  }
}
</script>
