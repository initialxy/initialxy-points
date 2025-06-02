export default defineNuxtRouteMiddleware(to => {
  console.log(to)
  if (to.path === '/login') {
    return
  }

  const { loggedIn } = useUserSession()
  if (!loggedIn.value) {
    return navigateTo('/login')
  }
})