<template>
  <div class="max-w-4xl mx-auto p-4">
    <UButton :to="`/dashboard`" variant="soft" color="neutral" class="mb-4">
      &larr; Back to Dashboard
    </UButton>

    <UCard>
      <template #header>
        <h1 class="text-2xl font-bold">Child Details</h1>
      </template>

      <div class="space-y-6">
        <div>
          <h2 class="text-lg font-semibold mb-3">Child Information</h2>
          <UCard variant="subtle">
            <p><span class="font-medium">Child ID:</span> {{ childId }}</p>
            <p>
              <span class="font-medium">Username:</span> Child {{ childId }}
            </p>
            <p><span class="font-medium">Points:</span> 150</p>
          </UCard>
        </div>

        <div>
          <h2 class="text-lg font-semibold mb-3">Pending Tasks</h2>
          <UCard variant="subtle">
            <ul class="list-disc pl-5 space-y-2">
              <li>Clean your room (10 points)</li>
              <li>Do homework (20 points)</li>
            </ul>
          </UCard>
        </div>

        <div>
          <h2 class="text-lg font-semibold mb-3">Completed Tasks</h2>
          <UCard variant="subtle">
            <ul class="list-disc pl-5 space-y-2">
              <li>Take out the trash (5 points)</li>
              <li>Feed the dog (15 points)</li>
            </ul>
          </UCard>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const childId = route.params.id
</script>
