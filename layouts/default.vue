<template>
  <div v-if="loggedIn">
    <main>
      <UContainer class="pt-4 md:pt-8">
        <div class="relative">
          <slot />
        </div>
      </UContainer>
    </main>

    <UModal
      v-model:open="showPasswordModal"
      title="Change Password"
      class="max-w-100"
    >
      <template #body>
        <UForm
          id="change-password-form"
          :schema="schema"
          :state="passwordFormState"
          class="space-y-4"
          @submit="changePasswordSubmit"
        >
          <UFormField name="currentPassword">
            <UInput
              v-model="passwordFormState.currentPassword"
              type="password"
              placeholder="Current password"
              class="w-full"
            />
          </UFormField>
          <UFormField name="newPassword">
            <UInput
              v-model="passwordFormState.newPassword"
              type="password"
              placeholder="New password"
              class="w-full"
            />
          </UFormField>
          <UFormField name="confirmNewPassword">
            <UInput
              v-model="passwordFormState.confirmNewPassword"
              type="password"
              placeholder="Confirm new password"
              class="w-full"
            />
          </UFormField>
        </UForm>
      </template>
      <template #footer>
        <div>
          <UButton
            form="change-password-form"
            type="submit"
            icon="i-lucide-check"
            color="primary"
            variant="solid"
            class="w-full"
            >Confirm</UButton
          >
        </div>
      </template>
    </UModal>

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
        :ui="{ leadingIcon: 'text-lg' }"
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
        :ui="{ leadingIcon: 'text-lg' }"
      />
      <UButton
        icon="i-lucide-menu"
        color="secondary"
        variant="solid"
        size="xl"
        @click="toggleMore"
        block
        class="w-10 h-10 rounded-full flex"
        :ui="{ leadingIcon: 'text-lg' }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod'

const { loggedIn } = useUserSession()
const store = useStore()
const toast = useToast()

const isMoreExpanded = ref(false)
const showPasswordModal = ref(false)

const passwordFormState = ref({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
})

const schema = z.object({
  currentPassword: z.string().min(4, 'Must be at least 4 characters'),
  newPassword: z.string().min(4, 'Must be at least 4 characters'),
  confirmNewPassword: z.string().min(4, 'Must be at least 4 characters'),
})

const toggleMore = async () => {
  isMoreExpanded.value = !isMoreExpanded.value
}

const logoutClicked = async () => {
  await store.logout()
  await sleep(200)
  await navigateTo('/login')
}

const changePassword = async () => {
  showPasswordModal.value = true
}

const changePasswordSubmit = async () => {
  // Check if new passwords match
  if (
    passwordFormState.value.newPassword !==
    passwordFormState.value.confirmNewPassword
  ) {
    toast.add({
      title: 'New passwords do not match',
      color: 'error',
      progress: false,
    })
    return
  }

  try {
    await $fetch('/api/auth/password', {
      method: 'POST',
      body: {
        currentPassword: passwordFormState.value.currentPassword,
        newPassword: passwordFormState.value.newPassword,
      },
    })

    toast.add({
      title: 'Password changed successfully',
      color: 'success',
      progress: false,
    })

    // Close modal and reset form
    showPasswordModal.value = false
    passwordFormState.value = {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    }
  } catch (error: any) {
    toast.add({
      title: error.data?.message || 'Failed to change password',
      color: 'error',
      progress: false,
    })
  }
}
</script>

<style scoped></style>
