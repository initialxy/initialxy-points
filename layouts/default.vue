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
        v-if="isMoreExpanded"
        icon="i-lucide-square-asterisk"
        color="info"
        variant="solid"
        size="xl"
        @click="changePassword"
        block
        class="w-10 h-10 rounded-full flex my-4"
        :ui="{leadingIcon: 'text-lg'}"
      />
      <UButton
        v-if="isMoreExpanded"
        icon="i-lucide-log-out"
        color="error"
        variant="solid"
        size="xl"
        @click="logoutClicked"
        block
        class="w-10 h-10 rounded-full flex my-4"
        :ui="{leadingIcon: 'text-lg'}"
      />
      <UButton
        icon="i-lucide-menu"
        color="secondary"
        variant="solid"
        size="xl"
        @click="toggleMore"
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

const isMoreExpanded = ref(false)

const toggleMore = async () => {
  isMoreExpanded.value = !isMoreExpanded.value
}

const logoutClicked = async () => {
  await store.logout()
  await sleep(200)
  await navigateTo('/login')
}

const changePassword = async () => {
}
</script>

<style scoped></style>
