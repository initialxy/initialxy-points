<template>
  <div v-if="loggedIn">
    <header>
      <nav>
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/dashboard">Dashboard</NuxtLink>
        <NuxtLink to="/tasks">Tasks</NuxtLink>
        <NuxtLink to="/rewards">Rewards</NuxtLink>
        <NuxtLink to="/login">Login</NuxtLink>
        <button @click="logoutClicked">Logout</button>
      </nav>
    </header>
    <main>
      <UContainer class="pt-4 md:pt-8">
        <div class="relative">
          <slot />
        </div>
      </UContainer>
    </main>
  </div>
</template>

<script setup lang="ts">
const { loggedIn } = useUserSession()
const store = useStore()

const logoutClicked = async () => {
  await store.logout()
  await sleep(200)
  await navigateTo('/login')
}
</script>

<style scoped>
header {
  background-color: #007bff;
  color: white;
  padding: 1rem;
}

nav a {
  margin-right: 1rem;
  color: white;
  text-decoration: none;
}

nav button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}
</style>
