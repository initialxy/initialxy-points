<template>
  <div>
    <header>
      <nav>
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/tasks" v-if="isAuthenticated()">Tasks</NuxtLink>
        <NuxtLink to="/rewards" v-if="isAuthenticated()">Rewards</NuxtLink>
        <NuxtLink to="/wishlist" v-if="isAuthenticated()">Wishlist</NuxtLink>
        <NuxtLink to="/login" v-if="!isAuthenticated()">Login</NuxtLink>
        <button @click="logoutClicked" v-if="isAuthenticated()">Logout</button>
      </nav>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const { user, loggedIn, login, logout, isAuthenticated } = useAuth()
const router = useRouter()

const logoutClicked = () => {
  logout()
  router.push('/login')
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

main {
  padding: 1rem;
}

/* Responsive design */
@media (max-width: 768px) {
  header,
  main {
    padding: 0.5rem;
  }

  nav a {
    font-size: 0.9rem;
  }

  nav button {
    font-size: 0.9rem;
    padding: 0.2rem 0.4rem;
  }
}

@media (max-width: 480px) {
  header,
  main {
    padding: 0.2rem;
  }

  nav a {
    font-size: 0.8rem;
    display: block;
    margin-bottom: 0.5rem;
  }

  nav {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  nav button {
    font-size: 0.8rem;
    padding: 0.1rem 0.2rem;
    margin-top: 0.5rem;
  }
}
</style>
