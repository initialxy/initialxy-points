<template>
  <div class="h-full w-full">
    <h1 class="text-3xl font-bold text-center">Your Points</h1>
    <div class="text-6xl font-extrabold text-primary text-center">
      {{ user?.points || 0 }}
    </div>
    <p class="text-xl text-gray-600 text-center">earned so far</p>
  </div>
</template>

<script setup lang="ts">
const { user: sessionUser } = useUserSession()
const user = sessionUser as Ref<User | null>
</script>

<style scoped></style>
