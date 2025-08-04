<template>
  <UApp>
    <NuxtLayout :name="loggedIn ? 'default' : 'login'">
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
const { loggedIn } = useUserSession()
</script>

<style>
html {
  font-size: 20px; /* Scale the app */
}
.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
  position: absolute;
  width: 100%;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
.page-enter-from {
  transform: translateX(10rem);
}
.page-leave-to {
  transform: translateX(-10rem);
}
</style>