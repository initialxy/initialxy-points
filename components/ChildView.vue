<template>
  <div class="max-w-100 mx-auto">
    <UCard class="mb-4" variant="subtle">
      <h1 class="text-3xl font-bold text-center mb-4">
        <span class="text-secondary">{{ user?.username }}</span>
        <span class="text-neutral-500"> earned</span>
      </h1>
      <div class="text-6xl font-extrabold text-primary text-center mb-4">
        {{ user?.points || 0 }}
        <span class="text-neutral-500 text-base absolute ml-2 mt-8">pts</span>
      </div>
      <p class="text-xl text-center text-neutral-500">
        <UIcon name="i-lucide-thumbs-up" />
        Keep it up!
      </p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { user: sessionUser } = useUserSession()
const user = sessionUser as Ref<User | null>
</script>

<style scoped></style>
