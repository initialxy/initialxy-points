<template>
  <UContainer>
    <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Tasks</h1>

    <div v-if="status === 'pending'" class="text-gray-500">Loading...</div>
    <div v-else-if="error" class="text-red-500">{{ error.message }}</div>

    <!-- Task creation form for parents -->
    <UCard v-if="user?.role === 'parent'" class="mb-8">
      <template #header>
        <h2 class="text-xl font-semibold">Create Task</h2>
      </template>
      <UForm
        :schema="taskSchema"
        :state="newTask"
        class="space-y-4"
        @submit="createTask"
      >
        <UFormField label="Task Description" name="description">
          <UInput v-model="newTask.description" class="w-full" />
        </UFormField>
        <UFormField label="Points" name="points">
          <UInput
            v-model.number="newTask.points"
            type="number"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Child" name="kid_id">
          <USelect
            v-model="newTask.kid_id"
            :options="childOptions"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Task Type" name="task_type">
          <USelect
            v-model="newTask.task_type"
            :options="taskTypeOptions"
            class="w-full"
          />
        </UFormField>
        <UButton type="submit" color="primary" :disabled="newTask.isLoading">
          Create Task
        </UButton>
      </UForm>
      <p v-if="taskError" class="text-red-500 mt-2">{{ taskError }}</p>
    </UCard>

    <!-- Task list -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">Task List</h2>
      </template>
      <template #default>
        <ul v-if="tasks?.length ?? 0 > 0" class="space-y-4">
          <li
            v-for="task in tasks"
            :key="task.id"
            class="p-4 bg-gray-100 rounded-lg shadow-sm"
          >
            <h2 class="font-semibold">{{ task.description }}</h2>
            <p>Points: {{ task.points }}</p>
            <p>Type: {{ task.task_type }}</p>

            <!-- Actions based on user role -->
            <div
              v-if="user?.role === 'child' && !task.is_marked_complete"
              class="mt-2"
            >
              <UButton size="sm" @click="markTaskComplete(task.id)"
                >Complete</UButton
              >
            </div>
            <div
              v-else-if="user?.role === 'parent' && task.is_marked_complete"
              class="mt-2 space-x-2"
            >
              <UButton size="sm" @click="approveTask(task.id)">Approve</UButton>
              <UButton size="sm" color="error" @click="rejectTask(task.id)"
                >Reject</UButton
              >
            </div>
            <div
              v-else-if="user?.role === 'parent' && !task.is_marked_complete"
              class="mt-2 space-x-2"
            >
              <UButton size="sm" @click="editTask(task)">Edit</UButton>
              <UButton size="sm" color="error" @click="deleteTask(task.id)"
                >Delete</UButton
              >
            </div>
            <div v-else class="mt-2">
              <UButton disabled>Completed (Awaiting Approval)</UButton>
            </div>
          </li>
        </ul>
        <p v-else class="text-gray-500">No tasks available</p>
      </template>
    </UCard>

    <!-- Task edit form for parents -->
    <UCard v-if="user?.role === 'parent' && editingTask" class="mt-8">
      <template #header>
        <h2 class="text-xl font-semibold">Edit Task</h2>
      </template>
      <UForm
        :schema="taskSchema"
        :state="editingTask"
        class="space-y-4"
        @submit="updateTask"
      >
        <UFormField label="Task Description" name="description">
          <UInput v-model="editingTask.description" class="w-full" />
        </UFormField>
        <UFormField label="Points" name="points">
          <UInput
            v-model.number="editingTask.points"
            type="number"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Task Type" name="task_type">
          <USelect
            v-model="editingTask.task_type"
            :options="taskTypeOptions"
            class="w-full"
          />
        </UFormField>
        <div class="space-x-2">
          <UButton type="submit" color="primary">Update Task</UButton>
          <UButton color="gray" @click="cancelEdit">Cancel</UButton>
        </div>
      </UForm>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import * as z from 'zod'

const toast = useToast()

const { user: sessionUser } = useUserSession()
const user = sessionUser as Ref<User | null>

// Fetch tasks data using useFetch directly in setup
const {
  data: tasks,
  error,
  status,
  refresh,
} = await useFetch<{ tasks: Task[] }>('/api/tasks')

// Fetch children data for parent task creation
const { data: usersData } = await useFetch<{ users: User[] }>('/api/users', {
  query: { role: 'all' },
})
const children = computed(
  () => usersData.value?.users.filter((u) => u.role === 'child') || []
)

const newTask = ref({
  description: '',
  points: 0,
  kid_id: null as number | null,
  task_type: 'throw-away',
  isLoading: false,
})

const taskError = ref('')

const taskSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  points: z.number().min(1, 'Points must be at least 1'),
  kid_id: z
    .number()
    .nullable()
    .refine((val) => val !== null, 'Child is required'),
  task_type: z.enum(['throw-away', 'perpetual']),
})

const createTask = async () => {
  if (!newTask.value.kid_id) {
    taskError.value = 'Please select a child for the task'
    return
  }

  newTask.value.isLoading = true

  try {
    const response = await $fetch<Task>('/api/tasks', {
      method: 'POST',
      body: newTask.value,
    })

    // Reset form
    newTask.value = {
      description: '',
      points: 0,
      kid_id: null,
      task_type: 'throw-away',
      isLoading: false,
    }

    taskError.value = ''

    // Show toast
    toast.add({
      title: `Task created successfully with ID: ${response.id}`,
    })

    // Refresh the task list
    await refresh()
  } catch (err) {
    console.error('Error creating task:', err)
    taskError.value = 'Failed to create task. Please try again.'
  } finally {
    newTask.value.isLoading = false
  }
}

const markTaskComplete = async (taskId: number) => {
  try {
    await $fetch(`/api/tasks/${taskId}/mark_complete`, {
      method: 'POST',
    })

    // Show toast
    toast.add({
      title: `Task marked as completed. Awaiting parent approval.`,
    })

    // Refresh the task list
    await refresh()
  } catch (err) {
    console.error('Error completing task:', err)
    toast.add({
      title: 'Error completing task. Please try again.',
    })
  }
}

const approveTask = async (taskId: number) => {
  try {
    await $fetch(`/api/tasks/${taskId}/approve_complete`, {
      method: 'POST',
    })

    // Show toast
    toast.add({
      title: `Task completion approved. Points awarded.`,
    })

    // Refresh the task list
    await refresh()
  } catch (err) {
    console.error('Error approving task:', err)
    toast.add({
      title: 'Error approving task. Please try again.',
    })
  }
}

const rejectTask = async (taskId: number) => {
  try {
    await $fetch(`/api/tasks/${taskId}/reject_complete`, {
      method: 'POST',
    })

    // Show toast
    toast.add({
      title: `Task completion rejected.`,
    })

    // Refresh the task list
    await refresh()
  } catch (err) {
    console.error('Error rejecting task:', err)
    toast.add({
      title: 'Error rejecting task. Please try again.',
    })
  }
}

// New code for task editing
const editingTask = ref<Task | null>(null)

const editTask = (task: Task) => {
  editingTask.value = { ...task }
}

const updateTask = async () => {
  if (!editingTask.value) return

  try {
    const response = await $fetch<Task>(`/api/tasks/${editingTask.value.id}`, {
      method: 'PUT',
      body: {
        description: editingTask.value.description,
        points: editingTask.value.points,
        task_type: editingTask.value.task_type,
      },
    })

    // Show toast
    toast.add({
      title: `Task updated successfully.`,
    })

    // Reset editing state
    editingTask.value = null

    // Refresh the task list
    await refresh()
  } catch (err) {
    console.error('Error updating task:', err)
    toast.add({
      title: 'Error updating task. Please try again.',
    })
  }
}

const cancelEdit = () => {
  editingTask.value = null
}

// New code for task deletion
const deleteTask = async (taskId: number) => {
  if (!confirm('Are you sure you want to delete this task?')) return

  try {
    await $fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    })

    // Show toast
    toast.add({
      title: `Task deleted successfully.`,
    })

    // Refresh the task list
    await refresh()
  } catch (err) {
    console.error('Error deleting task:', err)
    toast.add({
      title: 'Error deleting task. Please try again.',
    })
  }
}

const childOptions = computed(() =>
  children.value.map((child) => ({
    label: child.username,
    value: child.id,
  }))
)

const taskTypeOptions = [
  { label: 'Throw-away (one-time)', value: 'throw-away' },
  { label: 'Perpetual (recurring)', value: 'perpetual' },
]
</script>
