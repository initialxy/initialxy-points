<template>
  <div v-if="loggedIn">
    <main>
      <UContainer class="pt-4 md:pt-8">
        <div class="relative">
          <slot />
        </div>
      </UContainer>
    </main>

    <div class="fixed bottom-4 left-4 z-10 overflow-hidden">
      <UButton
        icon="i-lucide-log-out"
        color="error"
        variant="solid"
        size="xl"
        @click="logoutClicked"
        block
        class="w-10 h-10 rounded-full flex"
        :ui="{leadingIcon: 'text-lg'}"
      />
    </div>
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

<style scoped></style>
