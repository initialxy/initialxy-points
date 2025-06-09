<template>
  <div class="login-form">
    <h2>Login</h2>
    <form @submit.prevent="loginClicked">
      <div>
        <label for="username">Username:</label>
        <input
          v-model="username"
          type="text"
          id="username"
          required
          aria-label="Username"
        />
      </div>
      <div>
        <label for="passcode">Passcode:</label>
        <input
          v-model="passcode"
          type="password"
          id="passcode"
          required
          aria-label="Passcode"
        />
      </div>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <button type="submit" :disabled="isLoading">
        <span v-if="isLoading">Logging in...</span>
        <span v-else>Login</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()

const username = ref('')
const passcode = ref('')
const { login } = useAuth()
const errorMessage = ref('')
const isLoading = ref(false)

const loginClicked = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    await login(username.value, passcode.value)
    return navigateTo('/dashboard')
  } catch (error) {
    console.error('Login failed:', error)
    errorMessage.value =
      'Login failed. Please check your credentials and try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.login-form:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.login-form h2 {
  text-align: center;
  color: #007bff;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.login-form div {
  margin-bottom: 1.25rem;
}

.login-form label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.login-form input {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
  font-size: 1rem;
}

.login-form input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.2);
}

.login-form button {
  width: 100%;
  padding: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    transform 0.3s;
  font-size: 1.1rem;
  font-weight: 600;
}

.login-form button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.login-form button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: #d9534f;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  background-color: #f8d7da;
  padding: 0.75rem;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}

/* Responsive design */
@media (max-width: 768px) {
  .login-form {
    max-width: 100%;
    padding: 1.5rem;
  }

  .login-form h2 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }

  .login-form input {
    padding: 0.8rem;
    font-size: 0.9rem;
  }

  .login-form button {
    padding: 0.8rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .login-form {
    padding: 1rem;
  }

  .login-form h2 {
    font-size: 1rem;
    margin-bottom: 0.75rem;
  }

  .login-form input {
    padding: 0.6rem;
    font-size: 0.8rem;
  }

  .login-form button {
    padding: 0.6rem;
    font-size: 0.9rem;
  }

  .error-message {
    font-size: 0.75rem;
    padding: 0.5rem;
  }
}
</style>
