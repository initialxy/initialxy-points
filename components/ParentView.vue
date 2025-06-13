<template>
  <div>
    <h2>Parent Dashboard</h2>
    <p>Manage your children's accounts and view their points.</p>
    <div>
      <h3>Create Task</h3>
      <form @submit.prevent="createTask">
        <div>
          <label for="description">Task Description:</label>
          <input v-model="newTask.description" type="text" id="description" required />
        </div>
        <div>
          <label for="points">Points:</label>
          <input v-model.number="newTask.points" type="number" id="points" required />
        </div>
        <div>
          <label for="child">Child:</label>
          <select v-model="newTask.kid_id" id="child" required>
            <option v-for="child in children" :key="child.id" :value="child.id">
              {{ child.username }}
            </option>
          </select>
        </div>
        <div>
          <label for="taskType">Task Type:</label>
          <select v-model="newTask.task_type" id="taskType" required>
            <option value="throw-away">Throw-away (one-time)</option>
            <option value="perpetual">Perpetual (recurring)</option>
          </select>
        </div>
        <button type="submit">Create Task</button>
      </form>
      <p v-if="taskError">{{ taskError }}</p>
    </div>
    <div>
      <h3>Children</h3>
      <ul v-if="points.length > 0">
        <li
          v-for="child in points"
          :key="child.child_id"
          @click="navigateToChild(child.child_id)"
        >
          {{ child.username }} - {{ child.points }} points
          <ul v-if="childWishlists.get(child.child_id)?.length ?? 0 > 0">
            <li
              v-for="wish in childWishlists.get(child.child_id)"
              :key="wish.id"
            >
              {{ wish.description }} ({{ wish.status }})
            </li>
          </ul>
        </li>
      </ul>
      <p v-else-if="status === 'pending'">Loading children data...</p>
      <p v-else-if="error">{{ error.message }}</p>
      <p v-else>No children found.</p>
    </div>
    <div v-if="user.role === 'parent'">
      <h3>Manage Tasks</h3>
      <ul v-if="tasks.length > 0">
        <li v-for="task in tasks" :key="task.id">
          {{ task.description }} ({{ task.task_type }}) - {{ task.points }} points
          <span v-if="task.is_marked_complete">
            <button @click="approveTask(task.id)">Approve</button>
            <button @click="rejectTask(task.id)">Reject</button>
          </span>
          <span v-else>(Not completed)</span>
        </li>
      </ul>
      <p v-else>No tasks available for management.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UsersResponse, WishlistItem, WishlistResponse, Task } from '~/types'
import { ref, watch, computed } from 'vue'
import { useFetch } from '#imports'

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

const children = computed(() =>
  data.value?.users.filter((user) => user.role === 'child') || []
)

const newTask = ref({
  description: '',
  points: 0,
  kid_id: null as number | null,
  task_type: 'throw-away',
})

const taskError = ref('')

const createTask = async () => {
  if (!newTask.value.kid_id) {
    taskError.value = 'Please select a child for the task'
    return
  }

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
    }

    taskError.value = ''

    // Show success message
    alert(`Task created successfully with ID: ${response.id}`)
  } catch (err) {
    console.error('Error creating task:', err)
    taskError.value = 'Failed to create task. Please try again.'
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
</script>

<style scoped>
h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
}

h3 {
  font-size: 1.25rem;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  color: #555;
}

form {
  max-width: 400px;
  margin-bottom: 2rem;
}

form div {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input, select, button {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  margin-top: 0.5rem;
}

button:hover {
  background-color: #0056b3;
}

ul {
  list-style-type: none;
  padding: 0;
  max-width: 600px;
  margin: 0 auto;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-bottom: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  transition:
    background-color 0.3s,
    transform 0.2s;
}

li:hover {
  background-color: #e0f7fa;
  transform: translateX(5px);
}

@media (max-width: 600px) {
  ul {
    padding: 0 1rem;
  }
}
</style>
