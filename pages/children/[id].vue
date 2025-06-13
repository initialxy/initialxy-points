<template>
  <UContainer>
    <h2 class="text-2xl font-bold mb-4">Child Dashboard</h2>
    <p class="mb-6">View and manage this child's account.</p>

    <UCard v-if="data">
      <template #header>
        <h3 class="text-xl font-semibold">
          {{ data?.user.username ?? 'Child' }}'s Details
        </h3>
      </template>
      <template #default>
        <p>Points: {{ data.points }}</p>

        <h4 class="mt-4 text-lg font-semibold">Rewards</h4>
        <ul v-if="rewardsData?.rewards.length ?? 0 > 0" class="space-y-4">
          <li
            v-for="reward in rewardsData.rewards"
            :key="reward.id"
            class="p-4 bg-gray-100 rounded-lg shadow-sm"
          >
            {{ reward.description }} ({{ reward.points }} points)
          </li>
        </ul>
        <p v-else-if="rewardsStatus === 'pending'" class="text-gray-500">
          Loading rewards...
        </p>
        <p v-else-if="rewardsError" class="text-red-500">
          {{ rewardsError.message }}
        </p>
        <p v-else class="text-gray-500">No rewards</p>
      </template>
    </UCard>

    <div v-else-if="status === 'pending'" class="text-gray-500">
      <p>Loading child data...</p>
    </div>

    <div v-else-if="error" class="text-red-500">
      <p>Error loading child data: {{ error.message }}</p>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import type {
  User,
  RewardsResponse,
  UserResponse,
} from '~/types'

const route = useRoute()
const childId = route.params.id
const { data, error, status } = await useFetch<UserResponse>(
  `/api/users/${childId}`
)

const {
  data: rewardsData,
  error: rewardsError,
  status: rewardsStatus,
} = await useFetch<RewardsResponse>(`/api/rewards?child_id=${childId}`)
</script>
<style scoped></style>
