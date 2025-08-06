<template>
  <div class="w-full">
    <UCard class="max-w-100 ml-auto mr-auto" variant="subtle">
      <h1 class="text-3xl font-bold text-center mb-4">
        <span class="text-info">{{user?.username}}</span>, you earned
      </h1>
      <div class="text-6xl font-extrabold text-primary text-center mb-4">
        {{ user?.points || 0 }}
      </div>
      <p class="text-xl text-center opacity-50">points so far</p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { user: sessionUser } = useUserSession()
const user = sessionUser as Ref<User | null>
</script>

<style scoped></style>
