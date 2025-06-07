<template>
  <div>
    <h2>Child Dashboard</h2>
    <p>View and manage this child's account.</p>
    <div v-if="data">
      <h3>{{ data.username }}'s Details</h3>
      <p>Points: {{ data.points }}</p>
      <!-- Add more details as needed -->
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

const route = useRoute()
const kidId = route.params.id
const { data, error, status } = await useFetch(`/api/kids/${kidId}`)
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
</style>
