<template>
  <div v-if="loggedIn">
    <main>
      <UContainer class="pt-4 md:pt-8">
        <div class="relative">
          <slot />
        </div>
      </UContainer>
    </main>
    
    <UButton
      icon="i-heroicons-arrow-left-on-rectangle"
      color="error"
      variant="solid"
      size="xl"
      class="fixed bottom-4 left-4 z-10"
      @click="logoutClicked"
    />
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
</style>
