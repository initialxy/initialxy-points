<template>
  <div>
    <h2>Parent Dashboard</h2>
    <p>Manage your children's accounts and view their points.</p>
    <div>
      <h3>Children</h3>
      <ul v-if="points && points.length > 0">
        <li
          v-for="child in points"
          :key="child.child_id"
          @click="navigateToChild(child.child_id)"
        >
          {{ child.username }} - {{ child.points }} points
        </li>
      </ul>
      <p v-else-if="status === 'pending'">Loading children data...</p>
      <p v-else-if="error">{{ error.message }}</p>
      <p v-else>No children found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { data, error, status } = await useFetch('/api/points')
const points = data?.points || []

const navigateToChild = (childId: number) => {
  router.push(`/children/${childId}`)
}
</script>

<style scoped>
h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
}

h3 {
  font-size: 1.25rem;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  color: #555;
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
  cursor: pointer;
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

@media (max-width: 600px) {
  ul {
    padding: 0 1rem;
  }
}
</style>
