<template>
  <div class="space-y-4 max-w-100 mx-auto">
    <div v-if="sortedTasks.length === 0" class="text-center">
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
      <div class="flex justify-between items-start space-x-2">
        <p class="text-nowrap text-ellipsis text-cyan-500 grow">
          {{ task.description }}
        </p>
        <UButton
          v-if="props.mode === 'parent'"
          size="sm"
          icon="i-lucide-x"
          color="error"
          variant="soft"
          @click="confirmDelete(task)"
        />
      </div>
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
          Points: {{ task.points }}
        </UBadge>
        <div class="grow space-x-2 flex justify-end">
          <UButton
            v-if="task.is_marked_complete"
            size="sm"
            icon="i-lucide-thumbs-down"
            color="error"
            variant="soft"
            @click="emit('reject', task)"
          />
          <UButton
            v-if="props.mode === 'parent' || !task.is_marked_complete"
            size="sm"
            icon="i-lucide-thumbs-up"
            color="success"
            variant="soft"
            @click="emit('complete', task)"
          />
          <UButton
            v-if="props.mode === 'parent'"
            size="sm"
            icon="i-lucide-pencil"
            color="neutral"
            variant="soft"
            @click="emit('edit', task)"
          />
        </div>
      </div>
    </UCard>

    <!-- Confirmation Modal -->
    <UModal
      v-model:open="isDeleteConfirmationModalOpen"
      title="Confirm Deletion"
    >
      <template #body>
        <p>Are you sure you want to delete this task?</p>
      </template>
      <template #footer>
        <div class="space-x-2">
          <UButton @click="deleteConfirmed" color="error"> Delete </UButton>
          <UButton
            @click="isDeleteConfirmationModalOpen = false"
            variant="soft"
            color="neutral"
          >
            Cancel
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const emit = defineEmits<{
  (e: 'reject', task: Task): void
  (e: 'complete', task: Task): void
  (e: 'edit', task: Task): void
  (e: 'delete', task: Task): void
}>()

const props = defineProps<{
  tasks: Task[]
  mode: 'parent' | 'child'
}>()

const isDeleteConfirmationModalOpen = ref(false)
const taskToDelete = ref<Task | null>(null)

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

const confirmDelete = (task: Task) => {
  taskToDelete.value = task
  isDeleteConfirmationModalOpen.value = true
}

const deleteConfirmed = () => {
  if (taskToDelete.value != null) {
    emit('delete', taskToDelete.value)
    isDeleteConfirmationModalOpen.value = false
    taskToDelete.value = null
  }
}
</script>
