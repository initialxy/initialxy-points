<template>
  <UContainer>
    <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Manage Rewards</h1>

    <UCard class="mb-8">
      <template #header>
        <h2 class="text-xl font-semibold">Create New Reward</h2>
      </template>
      <UForm :schema="rewardSchema" :state="newReward" class="space-y-4" @submit="createReward">
        <UFormField label="Description" name="description">
          <UInput v-model="newReward.description" class="w-full" />
        </UFormField>
        <UFormField label="Points" name="points">
          <UInput v-model.number="newReward.points" type="number" class="w-full" />
        </UFormField>
        <UButton type="submit" color="primary" :disabled="newReward.isLoading">
          Create Reward
        </UButton>
      </UForm>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">Available Rewards</h2>
      </template>
      <template #default>
        <div v-if="status === 'pending'" class="text-gray-500">Loading...</div>
        <div v-else-if="error" class="text-red-500">{{ error.message }}</div>
        <ul v-if="data && data.rewards.length > 0" class="space-y-4">
          <li v-for="reward in data.rewards" :key="reward.id" class="p-4 bg-gray-100 rounded-lg shadow-sm">
            <h3 class="font-semibold">{{ reward.description }}</h3>
            <p>Points: {{ reward.points }}</p>
          </li>
        </ul>
        <p v-else class="text-gray-500">No rewards available</p>
      </template>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import type { RewardsResponse } from '~/types'
import * as z from 'zod'

const newReward = ref({
  description: '',
  points: 0,
  isLoading: false,
})

// Fetch rewards data using useFetch directly in setup
const { data, error, status, refresh } =
  await useFetch<RewardsResponse>('/api/rewards')

const rewardSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  points: z.number().min(1, 'Points must be at least 1'),
})

const createReward = async () => {
  newReward.value.isLoading = true

  try {
    await $fetch('/api/rewards', {
      method: 'POST',
      body: newReward.value,
    })

    // Clear form and refresh rewards list
    newReward.value = { description: '', points: 0, isLoading: false }
    await refresh()
  } catch (err) {
    console.error('Error creating reward:', err)
  } finally {
    newReward.value.isLoading = false
  }
}
</script>

<style scoped>
</style>