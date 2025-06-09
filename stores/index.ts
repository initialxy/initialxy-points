import { defineStore } from 'pinia'

export const useStore = defineStore('main', () => {
  const isLoggedIn = ref(false)

  const login = async (username: string, passcode: string) => {
    const { fetch: refreshSession } = useUserSession()
    try {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: { username, passcode },
      })
      await refreshSession()
      isLoggedIn.value = true
    } catch (err) {
      console.error('Login error:', err)
      throw err
    }
  }

  const logout = () => {
    const { clear: clearSession } = useUserSession()
    clearSession()
    isLoggedIn.value = false
  }

  return {isLoggedIn}
})