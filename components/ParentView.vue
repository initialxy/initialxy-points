<template>
  <div v-if="childrenData?.users.length ?? 0 > 0" class="space-y-4">
    <UCard v-for="child in childrenData?.users" :key="child.id">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold">{{ child.username }}</h2>
          <p class="text-gray-600">{{ child.points }} points</p>
        </div>
        <div class="flex items-center space-x-2">
          <UButton
            icon="i-heroicons-minus-circle"
            color="error"
            variant="ghost"
            @click="decrementPoints(child)"
            :disabled="loadingPoints === child.id"
          />
          <span class="text-2xl font-bold">{{ child.points }}</span>
          <UButton
            icon="i-heroicons-plus-circle"
            color="success"
            variant="ghost"
            @click="incrementPoints(child)"
            :disabled="loadingPoints === child.id"
          />
        </div>
      </div>
    </UCard>
  </div>
  <USkeleton v-else-if="childrenDataStatus === 'pending'" />
</template>

<script setup lang="ts">
const {
  data: childrenData,
  status: childrenDataStatus,
  refresh,
} = await useFetch<UsersResponse>('/api/users')

const loadingPoints = ref<number | null>(null)

const incrementPoints = async (child: User) => {
  loadingPoints.value = child.id
  try {
    const newPoints = (child.points || 0) + 1
    await $fetch(`/api/users/${child.id}/points`, {
      method: 'PUT',
      body: { points: newPoints },
    })
    // Refresh the user data
    await refresh()
  } catch (err) {
    console.error('Error incrementing points:', err)
    alert('Failed to increment points')
  } finally {
    loadingPoints.value = null
  }
}

const decrementPoints = async (child: User) => {
  loadingPoints.value = child.id
  try {
    const newPoints = Math.max((child.points || 0) - 1, 0)
    await $fetch(`/api/users/${child.id}/points`, {
      method: 'PUT',
      body: { points: newPoints },
    })
    // Refresh the user data
    await refresh()
  } catch (err) {
    console.error('Error decrementing points:', err)
    alert('Failed to decrement points')
  } finally {
    loadingPoints.value = null
  }
}
</script>

<style scoped></style>
