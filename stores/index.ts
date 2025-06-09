import { defineStore } from 'pinia'

export const useStore = defineStore('main', () => {
  const login = async (username: string, passcode: string) => {
    const { fetch: refreshSession } = useUserSession()
    try {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: { username, passcode },
      })
      await refreshSession()
    } catch (err) {
      console.error('Login error:', err)
      throw err
    }
  }

  const logout = async () => {
    const { clear: clearSession } = useUserSession()
    await clearSession()
  }

  return { login, logout }
})
