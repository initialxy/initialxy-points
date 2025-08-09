<template>
  <div v-if="childrenData?.users.length ?? 0 > 0" class="w-full">
    <UCard
      v-for="child in childrenData?.users" :key="child.id"
      class="mb-4 max-w-100 ml-auto mr-auto"
      variant="subtle"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold">{{ child.username }}</h2>
        <div class="flex items-center space-x-2">
          <UButton
            icon="i-lucide-minus"
            color="error"
            variant="soft"
            size="xl"
            class="m-0 touch-manipulation"
            @click="changePoints(child, -1)"
          />
          <UInput
            v-model="child.points"
            type="number"
            variant="none"
            class="w-15 m-0"
            size="xl"
            :ui="{ base: 'text-center' }"
            @update:modelValue="debouncedUpdatePoints(child.id, child.points || 0)"
          />
          <UButton
            icon="i-lucide-plus"
            color="success"
            variant="soft"
            size="xl"
            class="ml-0 touch-manipulation"
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
