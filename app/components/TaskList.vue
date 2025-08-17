<template>
  <div class="space-y-4">
    <div v-if="sortedTasks.length === 0" class="text-center py-4">
      <p class="text-muted">No task yet</p>
    </div>
    <UCard v-else v-for="task in sortedTasks" :key="task.id" class="w-full">
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-xl font-semibold">{{ task.description }}</h3>
          <p class="text-muted mt-2">Points: {{ task.points }}</p>
          <p class="text-sm text-muted mt-2">Type: {{ task.task_type }}</p>
        </div>
        <UBadge
          :variant="task.is_marked_complete ? 'subtle' : 'outline'"
          :color="task.is_marked_complete ? 'success' : 'neutral'"
        >
          {{ task.is_marked_complete ? 'Completed' : 'Pending' }}
        </UBadge>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  tasks: Task[]
}>()

const sortedTasks = computed(() => {
  return [...props.tasks].sort((a, b) => {
    // 1. Completed tasks go first
    if (a.is_marked_complete && !b.is_marked_complete) return -1
    if (!a.is_marked_complete && b.is_marked_complete) return 1

    // 2. Higher points go first
    if (b.points !== a.points) {
      return b.points - a.points
    }

    // 3. Alphabetical by description
    return a.description.localeCompare(b.description)
  })
})
</script>
