<template>
  <div class="max-w-4xl mx-auto p-4">
    <div class="max-w-100 mx-auto">
      <UCard class="mb-4" variant="subtle">
        <h1 class="text-3xl font-bold text-center mb-4">
          <span class="text-secondary">{{ child?.user?.username }}</span>
          <span class="text-neutral-500"> earned</span>
        </h1>
        <div class="text-6xl font-extrabold text-primary text-center mb-4">
          {{ child?.user?.points || 0 }}
          <span class="text-neutral-500 text-base absolute ml-2 mt-8">pts</span>
        </div>
        <p class="text-xl text-center text-neutral-500">
          <UIcon name="i-lucide-thumbs-up" />
          Keep it up!
        </p>
      </UCard>
    </div>

    <hr
      class="max-w-100 mx-auto bg-neutral-200 dark:bg-neutral-800 border-none h-px my-6"
    />

    <LogList :logs="logs?.logs || []" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const childId = route.params.id

const MAX_LOG_LIMIT = 20

const { data: child } = await useFetch<UserResponse>(`/api/users/${childId}`)

const { data: logs } = await useFetch<LogsResponse>('/api/logs', {
  query: {
    limit: MAX_LOG_LIMIT,
    recipient_id: childId,
  },
})
</script>
