<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Parent Dashboard</h2>
    <p class="mb-6">Manage your children's accounts and view their points.</p>

    <UCard class="mb-8">
      <template #header>
        <h3 class="text-xl font-semibold">Create Task</h3>
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

    <UCard class="mb-8">
      <template #header>
        <h3 class="text-xl font-semibold">Children</h3>
      </template>
      <template #default>
        <ul v-if="points.length > 0" class="space-y-4">
          <li
            v-for="child in points"
            :key="child.child_id"
            class="p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition-colors cursor-pointer"
            @click="navigateToChild(child.child_id)"
          >
            <div class="font-semibold">
              {{ child.username }} - {{ child.points }} points
            </div>
            <ul
              v-if="childWishlists.get(child.child_id)?.length ?? 0 > 0"
              class="mt-2 space-y-2"
            >
              <li
                v-for="wish in childWishlists.get(child.child_id)"
                :key="wish.id"
                class="text-sm"
              >
                {{ wish.description }} ({{ wish.status }})
              </li>
            </ul>
          </li>
        </ul>
        <p v-else-if="status === 'pending'" class="text-gray-500">
          Loading children data...
        </p>
        <p v-else-if="error" class="text-red-500">{{ error.message }}</p>
        <p v-else class="text-gray-500">No children found.</p>
      </template>
    </UCard>

    <UCard v-if="user.role === 'parent'">
      <template #header>
        <h3 class="text-xl font-semibold">Manage Tasks</h3>
      </template>
      <template #default>
        <ul v-if="tasks.length > 0" class="space-y-4">
          <li
            v-for="task in tasks"
            :key="task.id"
            class="p-4 bg-gray-100 rounded-lg shadow-sm"
          >
            <div class="font-semibold">
              {{ task.description }} ({{ task.task_type }}) -
              {{ task.points }} points
            </div>
            <div v-if="task.is_marked_complete" class="mt-2 space-x-2">
              <UButton size="sm" @click="approveTask(task.id)">Approve</UButton>
              <UButton size="sm" color="red" @click="rejectTask(task.id)"
                >Reject</UButton
              >
            </div>
            <div v-else class="text-gray-500 mt-2">(Not completed)</div>
          </li>
        </ul>
        <p v-else class="text-gray-500">No tasks available for management.</p>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type {
  UsersResponse,
  WishlistItem,
  WishlistResponse,
  Task,
} from '~/types'
import { ref, watch, computed } from 'vue'
import { useFetch } from '#imports'
import * as z from 'zod'

const { data, error, status } = await useFetch<UsersResponse>('/api/users')

const childWishlists = ref<Map<number, WishlistItem[]>>(new Map())

const navigateToChild = (childId: number) => {
  navigateTo(`/children/${childId}`)
}

watch(
  data,
  async (newData) => {
    if (newData) {
      for (const user of newData.users) {
        if (user.role === 'child') {
          try {
            const response = await $fetch<WishlistResponse>(
              `/api/wishlist?child_id=${user.id}`
            )
            childWishlists.value.set(user.id, response.wishlist)
          } catch (err) {
            console.error(`Error fetching wishlist for child ${user.id}:`, err)
          }
        }
      }
    }
  },
  { immediate: true }
)

const points = computed(
  () =>
    data.value?.users.map((user) => ({
      child_id: user.id,
      username: user.username,
      points: user.points,
    })) || []
)

const children = computed(
  () => data.value?.users.filter((user) => user.role === 'child') || []
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

    // Show success message
    alert(`Task created successfully with ID: ${response.id}`)
  } catch (err) {
    console.error('Error creating task:', err)
    taskError.value = 'Failed to create task. Please try again.'
  } finally {
    newTask.value.isLoading = false
  }
}

// Fetch tasks for the parent
const { user } = useUserSession()
const { data: tasks } = await useFetch<{ tasks: Task[] }>('/api/tasks')

const approveTask = async (taskId: number) => {
  try {
    await $fetch(`/api/tasks/${taskId}/approve_complete`, {
      method: 'POST',
    })
    alert('Task completion approved')
    // Refresh tasks
    await tasks.refresh()
  } catch (err) {
    console.error('Error approving task:', err)
    alert('Failed to approve task')
  }
}

const rejectTask = async (taskId: number) => {
  try {
    await $fetch(`/api/tasks/${taskId}/reject_complete`, {
      method: 'POST',
    })
    alert('Task completion rejected')
    // Refresh tasks
    await tasks.refresh()
  } catch (err) {
    console.error('Error rejecting task:', err)
    alert('Failed to reject task')
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

<style scoped></style>
