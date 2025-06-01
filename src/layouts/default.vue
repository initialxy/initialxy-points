<template>
  <div>
    <header>
      <nav>
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/tasks" v-if="authStore.isAuthenticated && authStore.user.role === 'kid'">Tasks</NuxtLink>
        <NuxtLink to="/rewards" v-if="authStore.isAuthenticated && authStore.user.role === 'parent'">Rewards</NuxtLink>
        <NuxtLink to="/wishlist" v-if="authStore.isAuthenticated && authStore.user.role === 'kid'">Wishlist</NuxtLink>
        <NuxtLink to="/login" v-if="!authStore.isAuthenticated">Login</NuxtLink>
        <button @click="logout" v-if="authStore.isAuthenticated">Logout</button>
      </nav>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push('/login');
};
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
  header, main {
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
  header, main {
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