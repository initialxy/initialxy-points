import { defineStore } from 'pinia'

const MAX_USERS_TO_REMEMBER = 3

export const useStore = defineStore('main', () => {
  const actionableUser: Ref<User | null> = ref(null)

  const login = async (username: string, password: string) => {
    const { fetch: refreshSession } = useUserSession()
    try {
      const sessionUser = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { username, password },
      })

      await refreshSession()

      const rememberedUsers = useRememberedUsers()

      const newUser = {
        username: sessionUser.user.username,
        timestamp: Date.now(),
      }
      rememberedUsers.value = rememberedUsers.value.filter(
        (u) => u.username !== newUser.username
      )
      rememberedUsers.value.unshift(newUser)
      rememberedUsers.value = rememberedUsers.value.slice(
        0,
        MAX_USERS_TO_REMEMBER
      )
    } catch (err) {
      console.error('Login error:', err)
      throw err
    }
  }

  const logout = async () => {
    const { clear: clearSession } = useUserSession()
    await clearSession()
  }

  const useRememberedUsers = () =>
    useLocalStorage<RememberedUser[]>('rememberedUsers', [])

  return {
    login,
    logout,
    useRememberedUsers,
    actionableUser,
  }
})
