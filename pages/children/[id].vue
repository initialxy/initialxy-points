<template>
  <div>
    <h2>Child Dashboard</h2>
    <p>View and manage this child's account.</p>
    <div v-if="data">
      <h3>{{ data?.user.username ?? 'Child' }}'s Details</h3>
      <p>Points: {{ data.points }}</p>
      <h4>Wishlist Items</h4>
      <ul v-if="wishlistData?.wishlist.length ?? 0 > 0">
        <li v-for="item in wishlistData.wishlist" :key="item.id">
          {{ item.description }} ({{ item.status }})
        </li>
      </ul>
      <p v-else-if="wishlistStatus === 'pending'">Loading wishlist...</p>
      <p v-else-if="wishlistError">{{ wishlistError.message }}</p>
      <p v-else>No wishlist items</p>
      <h4>Rewards</h4>
      <ul v-if="rewardsData?.rewards.length ?? 0 > 0">
        <li v-for="reward in rewardsData.rewards" :key="reward.id">
          {{ reward.description }} ({{ reward.points }} points)
        </li>
      </ul>
      <p v-else-if="rewardsStatus === 'pending'">Loading rewards...</p>
      <p v-else-if="rewardsError">{{ rewardsError.message }}</p>
      <p v-else>No rewards</p>
    </div>
    <div v-else-if="status === 'pending'">
      <p>Loading child data...</p>
    </div>
    <div v-else-if="error">
      <p>Error loading child data: {{ error.message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { User, WishlistResponse, RewardsResponse, UserResponse } from '~/types'

const route = useRoute()
const childId = route.params.id
const { data, error, status } = await useFetch<UserResponse>(`/api/users/${childId}`)

const {
  data: wishlistData,
  error: wishlistError,
  status: wishlistStatus,
} = await useFetch<WishlistResponse>(`/api/wishlist?child_id=${childId}`)

const {
  data: rewardsData,
  error: rewardsError,
  status: rewardsStatus,
} = await useFetch<RewardsResponse>(`/api/rewards?child_id=${childId}`)
</script>

<style scoped>
h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

h3 {
  font-size: 1.25rem;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

h4 {
  font-size: 1.1rem;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

ul {
  list-style-type: none;
  padding: 0;
}
</style>
