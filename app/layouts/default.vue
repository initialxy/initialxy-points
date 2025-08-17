<template>
  <div v-if="loggedIn">
    <main>
      <UContainer class="pt-4 md:pt-8">
        <div class="relative">
          <slot />
        </div>
      </UContainer>
    </main>

    <AppMenu class="fixed bottom-4 left-4 z-10 space-y-4" />
    <AppAction class="fixed bottom-4 right-4 z-10 space-y-4" />
  </div>
</template>

<script setup lang="ts">
const { loggedIn } = useUserSession()
</script>
