<template>
  <div class="space-y-4 max-w-150 mx-auto">
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
        root: 'ring-cyan-200 dark:ring-cyan-800/50 bg-cyan-200/20 dark:bg-cyan-800/20',
      }"
    >
      <div class="flex justify-start items-start space-x-2">
        <p
          class="truncate text-cyan-700 dark:text-cyan-200 grow min-w-0"
          data-testid="task-description"
        >
          {{ task.description }}
        </p>
        <UButton
          v-if="props.mode === 'parent'"
          size="sm"
          icon="i-lucide-x"
          color="error"
          variant="soft"
          data-testid="delete-task-button"
          @click="confirmDelete(task)"
        />
      </div>
      <div class="flex justify-start items-start mt-2 space-x-2">
        <UBadge
          v-if="task.is_marked_complete"
          variant="subtle"
          color="primary"
          icon="i-lucide-bell-ring"
          class="size-6 justify-center"
          data-testid="alerted-state-badge"
        />
        <UBadge
          v-if="!task.is_marked_complete"
          variant="outline"
          color="neutral"
          icon="i-lucide-circle-dashed"
          class="size-6 justify-center ring-cyan-200 dark:ring-cyan-800/50 bg-cyan-200/20 dark:bg-cyan-800/20 text-cyan-700 dark:text-cyan-200"
          data-testid="pending-state-badge"
        />
        <UBadge
          class="ring-cyan-200 dark:ring-cyan-800/50 bg-cyan-200/20 dark:bg-cyan-800/20 text-cyan-700 dark:text-cyan-200"
          :icon="getRecurrenceTypeIcon(task)"
          color="neutral"
          variant="outline"
        >
          Points: {{ task.points }}
        </UBadge>
        <div class="grow min-w-0 space-x-2 flex justify-end">
          <UButton
            v-if="task.is_marked_complete"
            size="sm"
            icon="i-lucide-thumbs-down"
            color="error"
            variant="soft"
            data-testid="reject-task-button"
            @click="emit('reject', task)"
          />
          <UButton
            v-if="props.mode === 'parent' || !task.is_marked_complete"
            size="sm"
            icon="i-lucide-thumbs-up"
            color="success"
            variant="soft"
            data-testid="complete-task-button"
            @click="emit('complete', task)"
          />
          <UButton
            v-if="props.mode === 'parent'"
            size="sm"
            icon="i-lucide-pencil"
            color="neutral"
            variant="soft"
            data-testid="edit-task-button"
            @click="emit('edit', task)"
          />
        </div>
      </div>
    </UCard>

    <!-- Confirmation Modal -->
    <UModal
      v-model:open="isDeleteConfirmationModalOpen"
      title="Confirm Deletion"
      class="max-w-150"
    >
      <template #body>
        <p>Are you sure you want to delete this task?</p>
      </template>
      <template #footer>
        <UButton
          :data-testid="'confirm-delete-button'"
          @click="deleteConfirmed"
          color="error"
          icon="i-lucide-trash"
        >
          Delete
        </UButton>
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

const getRecurrenceTypeIcon = (task: Task) => {
  switch (task.recurrence_type) {
    case 'single-use':
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
