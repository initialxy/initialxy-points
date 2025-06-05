<template>
  <div>
    <h1>My Tasks</h1>
    <Notification
      v-if="notification"
      :message="notification.message"
      :type="notification.type"
    />
    <ul v-if="tasks.length">
      <li v-for="task in tasks" :key="task.id">
        <h2>{{ task.title }}</h2>
        <p>{{ task.description }}</p>
        <p>Points: {{ task.points }}</p>
        <button @click="completeTask(task.id)" :disabled="task.completed">
          Complete
        </button>
      </li>
    </ul>
    <p v-else>No tasks available</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useFetch } from '#app'
import Notification from '@/components/Notification.vue'

const tasks = ref([])
const { user, loggedIn, login, logout, isAuthenticated } = useAuth()
const notification = ref(null)

onMounted(async () => {
  const { data, error } = await useFetch('/api/tasks', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  })

  if (error.value) {
    console.error('Error fetching tasks:', error.value)
    return
  }

  tasks.value = data.value
})

const completeTask = async (taskId: number) => {
  const { data, error } = await useFetch(`/api/tasks/${taskId}/complete`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  })

  if (error.value) {
    console.error('Error completing task:', error.value)
    return
  }

  // Update task status locally
  const task = tasks.value.find((t) => t.id === taskId)
  if (task) {
    task.completed = true
  }

  // Show notification
  notification.value = {
    message: `Task completed! You earned ${data.value.pointsEarned} points.`,
    type: 'success',
  }

  // Clear notification after 3 seconds
  setTimeout(() => {
    notification.value = null
  }, 3000)
}
</script>

<style scoped>
h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

li {
  margin-bottom: 2rem;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Responsive design */
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
