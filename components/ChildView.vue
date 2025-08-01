<template>
  <div class="flex flex-col items-center justify-center h-full space-y-4">
    <h1 class="text-3xl font-bold">Your Points</h1>
    <div class="text-6xl font-extrabold text-primary">
      {{ user?.points || 0 }}
    </div>
    <p class="text-xl text-gray-600">Points earned so far</p>
  </div>
</template>

<script setup lang="ts">
const { user: sessionUser } = useUserSession()
const user = sessionUser as Ref<User | null>
</script>

<style scoped></style>
