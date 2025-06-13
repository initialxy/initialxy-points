<template>
  <div>
    <h1>Tasks</h1>
    <Notification
      v-if="notification"
      :message="notification.message"
      :type="notification.type"
    />
    <div v-if="status === 'pending'">Loading...</div>
    <div v-else-if="error">{{ error.message }}</div>

    <!-- Task creation form for parents -->
    <div v-if="user?.role === 'parent'">
      <h2>Create Task</h2>
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

    <!-- Task list -->
    <ul v-if="tasks?.length ?? 0 > 0">
      <li v-for="task in tasks" :key="task.id">
        <h2>{{ task.description }}</h2>
        <p>Points: {{ task.points }}</p>
        <p>Type: {{ task.task_type }}</p>

        <!-- Actions based on user role -->
        <div v-if="user?.role === 'child' && !task.is_marked_complete">
          <button @click="markTaskComplete(task.id)">Complete</button>
        </div>
        <div v-else-if="user?.role === 'parent' && task.is_marked_complete">
          <button @click="approveTask(task.id)">Approve</button>
          <button @click="rejectTask(task.id)">Reject</button>
        </div>
        <div v-else>
          <button disabled>Completed (Awaiting Approval)</button>
        </div>
      </li>
    </ul>
    <p v-else>No tasks available</p>
  </div>
</template>

<script setup lang="ts">
import type { Task, Notification, User } from '~/types'
import { ref, computed } from 'vue'
import { useFetch } from '#imports'

const { user: sessionUser } = useUserSession()
const user = sessionUser as Ref<User | null>

const notification = ref<Notification | null>(null)

// Fetch tasks data using useFetch directly in setup
const {
  data: tasks,
  error,
  status,
  refresh,
} = await useFetch<{ tasks: Task[] }>('/api/tasks')

// Fetch children data for parent task creation
const { data: usersData } = await useFetch<{ users: User[] }>('/api/users')
const children = computed(() =>
  usersData.value?.users.filter((u) => u.role === 'child') || []
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

    // Show notification
    notification.value = {
      message: `Task created successfully with ID: ${response.id}`,
      type: 'success',
    }

    // Clear notification after 3 seconds
    setTimeout(() => {
      notification.value = null
    }, 3000)

    // Refresh the task list
    await refresh()
  } catch (err) {
    console.error('Error creating task:', err)
    taskError.value = 'Failed to create task. Please try again.'
  }
}

const markTaskComplete = async (taskId: number) => {
  try {
    await $fetch(`/api/tasks/${taskId}/mark_complete`, {
      method: 'POST',
    })

    // Show notification
    notification.value = {
      message: `Task marked as completed. Awaiting parent approval.`,
      type: 'info',
    }

    // Clear notification after 3 seconds
    setTimeout(() => {
      notification.value = null
    }, 3000)

    // Refresh the task list
    await refresh()
  } catch (err) {
    console.error('Error completing task:', err)
    notification.value = {
      message: 'Error completing task. Please try again.',
      type: 'error',
    }
  }
}

const approveTask = async (taskId: number) => {
  try {
    await $fetch(`/api/tasks/${taskId}/approve_complete`, {
      method: 'POST',
    })

    // Show notification
    notification.value = {
      message: `Task completion approved. Points awarded.`,
      type: 'success',
    }

    // Clear notification after 3 seconds
    setTimeout(() => {
      notification.value = null
    }, 3000)

    // Refresh the task list
    await refresh()
  } catch (err) {
    console.error('Error approving task:', err)
    notification.value = {
      message: 'Error approving task. Please try again.',
      type: 'error',
    }
  }
}

const rejectTask = async (taskId: number) => {
  try {
    await $fetch(`/api/tasks/${taskId}/reject_complete`, {
      method: 'POST',
    })

    // Show notification
    notification.value = {
      message: `Task completion rejected.`,
      type: 'info',
    }

    // Clear notification after 3 seconds
    setTimeout(() => {
      notification.value = null
    }, 3000)

    // Refresh the task list
    await refresh()
  } catch (err) {
    console.error('Error rejecting task:', err)
    notification.value = {
      message: 'Error rejecting task. Please try again.',
      type: 'error',
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
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

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

ul {
  list-style-type: none;
  padding: 0;
  max-width: 600px;
  margin: 0 auto;
}

li {
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  h1 {
    font-size: 1.5rem;
  }

  p {
    font-size: 0.9rem;
  }

  button {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.2rem;
  }

  p {
    font-size: 0.8rem;
  }

  button {
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
  }
}
</style>
