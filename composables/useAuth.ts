import { useState } from '#app'

export const useAuth = () => {
  const loggedIn = useState('loggedIn', () => false)
  const user = useState('user', () => null)

  const { clear: clearSession, fetch: refreshSession } = useUserSession()

  const login = async (username: string, passcode: string) => {
    try {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: { username, passcode },
      })
      await refreshSession()
      loggedIn.value = true
    } catch (err) {
      console.error('Login error:', err)
      throw err
    }
  }

  const logout = () => {
    clearSession()
    loggedIn.value = false
    user.value = null
  }

  const isAuthenticated = () => {
    return loggedIn.value && user.value != null
  }

  return { user, loggedIn, login, logout, isAuthenticated }
}