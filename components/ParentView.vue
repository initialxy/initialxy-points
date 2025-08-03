<template>
  <div v-if="childrenData?.users.length ?? 0 > 0">
    <UCard v-for="child in childrenData?.users" :key="child.id">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold">{{ child.username }}</h2>
        <div class="flex items-center space-x-2">
          <UButton
            icon="i-heroicons-minus"
            color="error"
            variant="soft"
            size="xl"
            class="m-2"
            @click="changePoints(child, -1)"
          />
          <span class="text-2xl font-bold">{{ child.points }}</span>
          <UButton
            icon="i-heroicons-plus"
            color="success"
            variant="soft"
            size="xl"
            class="m-2"
            @click="changePoints(child, 1)"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const DEBOUNCE_WAIT_MS = 300
const toast = useToast()

const {
  data: childrenData,
  refresh,
} = await useFetch<UsersResponse>('/api/users')

const debouncedUpdatePoints = debounce(async (childId: number, newPoints: number) => {
  try {
    await $fetch(`/api/users/${childId}/points`, {
      method: 'PUT',
      body: { points: newPoints },
    })
    await refresh()
  } catch (err) {
    console.error('Error updating points:', err)
    toast.add({ title: 'Failed to update points', progress: false })
  }
}, DEBOUNCE_WAIT_MS)

const changePoints = async (child: User, delta: number) => {
  const updatedPoints = Math.max((child.points || 0) + delta, 0)
  const updatedData = {
    users: childrenData.value?.users.map(u => 
      u.id === child.id ? { ...u, points: updatedPoints } : u
    )
  } as UsersResponse
  childrenData.value = updatedData
  
  debouncedUpdatePoints(child.id, updatedPoints)
}
</script>

<style scoped></style>
