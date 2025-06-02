import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useFetch } from '#app'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const token = ref(null)

  const login = async (username: string, passcode: string) => {
    try {
      const { data, error } = await useFetch('/api/auth/login', {
        method: 'POST',
        body: { username, passcode },
      })

      if (error.value) {
        throw new Error(error.value.message || 'Login failed')
      }

      const responseData = data.value as any
      token.value = responseData.token
      user.value = responseData.user
      isAuthenticated.value = true
    } catch (err) {
      console.error('Login error:', err)
      throw err
    }
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    token.value = null
  }

  return { user, isAuthenticated, token, login, logout }
})
