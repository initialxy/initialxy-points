
export const useAuthStore = defineStore('auth', () => {
  const { loggedIn, user, clear: clearSession, fetch: refreshSession } = useUserSession()

  const login = async (username: string, passcode: string) => {
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

  const logout = () => {
    clearSession()
  }

  const isAuthenticated = () => {
    return loggedIn.value && user.value != null
  }

  return { user, loggedIn, login, logout, isAuthenticated }
})
