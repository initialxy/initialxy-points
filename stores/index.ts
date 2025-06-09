import { defineStore } from 'pinia'
import type { User } from '~/types'

export const useStore = defineStore('main', () => {
  const user: Ref<User | null> = ref(null)

  const login = async (username: string, passcode: string) => {
    const { fetch: refreshSession } = useUserSession()
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { username, passcode },
      })
      user.value = response.user
      await refreshSession()
    } catch (err) {
      console.error('Login error:', err)
      throw err
    }
  }

  const logout = () => {
    const { clear: clearSession } = useUserSession()
    clearSession()
    user.value = null
  }

  return { user, login, logout }
})
