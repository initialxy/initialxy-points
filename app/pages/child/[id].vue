<template>
  <div>
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
          <UBadge
            variant="subtle"
            size="xl"
            icon="i-lucide-clipboard-list"
            class="ring-cyan-200 dark:ring-cyan-800 bg-cyan-200/20 dark:bg-cyan-800/20 text-cyan-500"
          >
            {{ getPendingTasksCount() }}
          </UBadge>
        </p>
      </UCard>
    </div>

    <hr
      class="max-w-100 mx-auto bg-neutral-200 dark:bg-neutral-800 border-none h-px my-6"
    />

    <TaskList
      :tasks="tasks?.tasks || []"
      @edit="handleEditTask"
      @complete="handleCompleteTask"
      @reject="handleRejectTask"
    />

    <hr
      class="max-w-100 mx-auto bg-neutral-200 dark:bg-neutral-800 border-none h-px my-6"
    />

    <LogList :logs="logs?.logs || []" />

    <!-- Edit Task Modal -->
    <UModal
      v-model:open="showEditTaskModal"
      title="Edit Task"
      class="max-w-100"
    >
      <template #body>
        <UForm
          id="edit-task-form"
          :schema="editTaskSchema"
          :state="editTaskState"
          class="space-y-4"
          @submit="editTaskSubmit"
        >
          <UFormField name="description">
            <UInput
              v-model="editTaskState.description"
              type="text"
              placeholder="Description"
              class="w-full"
            />
          </UFormField>
          <UFormField name="points">
            <UInput
              v-model="editTaskState.points"
              type="number"
              placeholder="Points"
              class="w-full"
            />
          </UFormField>
          <UFormField name="taskType">
            <USelect
              v-model="editTaskState.taskType"
              :items="taskTypeItems"
              class="w-full"
            />
          </UFormField>
        </UForm>
      </template>
      <template #footer>
        <div>
          <UButton
            form="edit-task-form"
            type="submit"
            icon="i-lucide-check"
            color="primary"
            variant="solid"
            class="w-full"
          >
            Update
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod'

const MAX_LOG_LIMIT = 20

const route = useRoute()
const store = useStore()
const toast = useToast()
const childId = route.params.id

const { data: child } = await useFetch<UserResponse>(`/api/users/${childId}`)
const { data: tasks } = await useFetch<TasksResponse>('/api/tasks', {
  query: {
    child_id: childId,
  },
})

const { data: logs } = await useFetch<LogsResponse>('/api/logs', {
  query: {
    limit: MAX_LOG_LIMIT,
    recipient_id: childId,
  },
})

onMounted(() => {
  store.actionableUser = child.value?.user || null
})

onUnmounted(() => {
  store.actionableUser = null
})

const getPendingTasksCount = () => {
  if (!tasks.value?.tasks) return 0
  return tasks.value.tasks.filter((task) => task.is_marked_complete).length
}

// Edit task modal state
const showEditTaskModal = ref(false)
const editingTask = ref<Task | null>(null)

// Form state for editing
const editTaskState: Ref<{
  description: string
  points: number | null
  taskType: 'throw-away' | 'perpetual'
}> = ref({
  description: '',
  points: null,
  taskType: 'throw-away',
})

// Schema for validation
const editTaskSchema = z.object({
  description: z.string().min(4, 'Must be at least 4 characters'),
  points: z.number().min(0, 'Must be at least 0').nullable(),
  taskType: z.enum(['throw-away', 'perpetual']),
})

// Task type items
const taskTypeItems = ref([
  { value: 'throw-away', label: 'Throw Away' },
  { value: 'perpetual', label: 'Perpetual' },
])

// Handle edit event from TaskList component
const handleEditTask = (task: Task) => {
  editingTask.value = task
  editTaskState.value = {
    description: task.description,
    points: task.points,
    taskType: task.task_type,
  }
  showEditTaskModal.value = true
}

// Handle complete event from TaskList component
const handleCompleteTask = async (task: Task) => {
  try {
    await $fetch(`/api/tasks/${task.id}/approve_complete`, {
      method: 'POST',
    })

    // Show success toast
    toast.add({
      title: 'Task completion approved',
      color: 'success',
      progress: false,
    })

    // Refresh data to reflect changes
    await refreshNuxtData()
  } catch (error: any) {
    console.error('Failed to approve task completion:', error)
    toast.add({
      title: 'Failed to approve task completion',
      color: 'error',
      progress: false,
    })
  }
}

// Handle reject event from TaskList component
const handleRejectTask = async (task: Task) => {
  try {
    await $fetch(`/api/tasks/${task.id}/reject_complete`, {
      method: 'POST',
    })

    // Show success toast
    toast.add({
      title: 'Task completion rejected',
      color: 'success',
      progress: false,
    })

    // Refresh data to reflect changes
    await refreshNuxtData()
  } catch (error: any) {
    console.error('Failed to reject task completion:', error)
    toast.add({
      title: 'Failed to reject task completion',
      color: 'error',
      progress: false,
    })
  }
}

// Submit edited task
const editTaskSubmit = async () => {
  if (!editingTask.value) return

  try {
    await $fetch(`/api/tasks/${editingTask.value.id}`, {
      method: 'PUT',
      body: {
        description: editTaskState.value.description,
        points: editTaskState.value.points || 0,
        task_type: editTaskState.value.taskType,
      },
    })

    // Show success toast
    toast.add({
      title: 'Task updated successfully',
      color: 'success',
      progress: false,
    })

    // Close modal and reset form
    showEditTaskModal.value = false
    editingTask.value = null

    // Refresh data to reflect changes
    await refreshNuxtData()
  } catch (error: any) {
    console.error('Failed to update task:', error)
    toast.add({
      title: 'Failed to update task',
      color: 'error',
      progress: false,
    })
  }
}
</script>
