<template>
  <div class="max-w-100 mx-auto">
    <UCard v-for="log in props.logs" :key="log.id" class="my-4">
      <p class="text-sm text-neutral-400 dark:text-neutral-600">
        <span v-if="log.timestamp">{{ formatShortDate(log.timestamp) }}</span>
        <span v-else>Unknown time</span>
      </p>
      <p>
        <FormattedLog :log="log" />
      </p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  logs: Log[]
}>()
</script>
