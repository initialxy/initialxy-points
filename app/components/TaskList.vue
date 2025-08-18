<template>
  <div class="space-y-4 max-w-100 mx-auto">
    <div v-if="sortedTasks.length === 0" class="text-center py-4">
      <p class="text-muted">No task yet</p>
    </div>
    <UCard
      v-else
      v-for="task in sortedTasks"
      :key="task.id"
      class="w-full"
      variant="subtle"
      :ui="{
        root: 'ring-cyan-200 dark:ring-cyan-800 bg-cyan-200/20 dark:bg-cyan-800/20',
      }"
    >
      <p class="text-nowrap text-ellipsis">{{ task.description }}</p>
      <div class="flex justify-between items-start mt-2 space-x-2">
        <UBadge
          v-if="task.is_marked_complete"
          :variant="task.is_marked_complete ? 'subtle' : 'outline'"
          :color="task.is_marked_complete ? 'success' : 'neutral'"
          icon="i-lucide-alarm-clock-check"
          class="h-6 w-6 justify-center"
        />
        <UBadge
          v-if="!task.is_marked_complete"
          :variant="task.is_marked_complete ? 'subtle' : 'outline'"
          :color="task.is_marked_complete ? 'success' : 'neutral'"
          icon="i-lucide-circle-dashed"
          class="h-6 w-6 justify-center ring-cyan-200 dark:ring-cyan-800 bg-cyan-200/20 dark:bg-cyan-800/20 text-cyan-500"
        />
        <UBadge
          class="ring-cyan-200 dark:ring-cyan-800 bg-cyan-200/20 dark:bg-cyan-800/20 text-cyan-500"
          :icon="getTaskTypeIcon(task)"
          color="neutral"
          variant="outline"
        >
          Pts: {{ task.points }}
        </UBadge>
        <div class="grow space-x-2 flex justify-end">
          <UButton
            v-if="task.is_marked_complete"
            size="sm"
            icon="i-lucide-x"
            color="error"
            variant="soft"
          />
          <UButton
            size="sm"
            icon="i-lucide-check"
            color="success"
            variant="soft"
          />
          <UButton
            size="sm"
            icon="i-lucide-pencil"
            color="neutral"
            variant="soft"
          />
        </div>
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

const getTaskTypeIcon = (task: Task) => {
  switch (task.task_type) {
    case 'throw-away':
      return 'i-lucide-square-check-big'
    case 'perpetual':
      return 'i-lucide-recycle'
    default:
      return 'i-lucide-circle-question-mark'
  }
}
</script>
