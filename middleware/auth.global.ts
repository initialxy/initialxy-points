export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()
  if (['/', '/login'].includes(to.path) && loggedIn.value) {
    return navigateTo('/dashboard')
  }

  if (to.path === '/login') {
    return
  }

  if (!loggedIn.value) {
    return navigateTo('/login')
  }
})
