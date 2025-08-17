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

    <div class="fixed bottom-4 left-4 z-10">
      <Transition
        enter-active-class="duration-150 bounce-timing"
        enter-from-class="transform opacity-0 translate-y-30"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="duration-150 ease-in-out"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="transform opacity-0 translate-y-30"
      >
        <div v-if="isMoreExpanded" key="logout-button">
          <UButton
            icon="i-lucide-log-out"
            color="error"
            variant="solid"
            size="xl"
            @click="logoutClicked"
            block
            class="w-10 h-10 rounded-full flex my-4"
            :ui="{ leadingIcon: 'text-lg' }"
          />
        </div>
      </Transition>
      <Transition
        enter-active-class="duration-150 bounce-timing delay-100"
        enter-from-class="transform opacity-0 translate-y-20"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="duration-150 ease-in-out"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="transform opacity-0 translate-y-20"
      >
        <div v-if="isMoreExpanded" key="change-password-button">
          <UButton
            icon="i-lucide-square-asterisk"
            color="info"
            variant="solid"
            size="xl"
            @click="changePassword"
            block
            class="w-10 h-10 rounded-full flex my-4"
            :ui="{ leadingIcon: 'text-lg' }"
          />
        </div>
      </Transition>
      <Transition
        enter-active-class="duration-150 bounce-timing delay-200"
        enter-from-class="transform opacity-0 translate-y-10"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="duration-150 ease-in-out"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="transform opacity-0 translate-y-10"
      >
        <div v-if="isMoreExpanded" key="refresh-button">
          <UButton
            icon="i-lucide-refresh-ccw"
            color="info"
            variant="solid"
            size="xl"
            @click="refresh"
            block
            class="w-10 h-10 rounded-full flex my-4"
            :ui="{ leadingIcon: 'text-lg' }"
          />
        </div>
      </Transition>
      <UButton
        icon="i-lucide-menu"
        color="secondary"
        variant="solid"
        size="xl"
        @click="isMoreExpanded = !isMoreExpanded"
        @blur="dismissMenu"
        block
        class="w-10 h-10 rounded-full flex"
        :ui="{ leadingIcon: 'text-lg' }"
      />
    </div>

    <!-- Floating action buttons -->
    <div class="fixed bottom-4 right-4 z-10">
      <Transition
        enter-active-class="duration-150 bounce-timing"
        enter-from-class="transform opacity-0 translate-y-10"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="duration-150 ease-in-out"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="transform opacity-0 translate-y-10"
      >
        <div
          v-if="store.actionableUser != null && isActionExpanded"
          key="create-task-button"
        >
          <UButton
            icon="i-lucide-clipboard-list"
            color="info"
            variant="solid"
            size="xl"
            block
            class="w-10 h-10 rounded-full flex my-4"
            :ui="{ leadingIcon: 'text-lg' }"
          />
        </div>
      </Transition>
      <UButton
        v-if="store.actionableUser != null"
        icon="i-lucide-plus"
        color="primary"
        variant="solid"
        size="xl"
        @click="isActionExpanded = !isActionExpanded"
        @blur="dismissAction"
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
const isActionExpanded = ref(false)
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

const refresh = async () => {
  refreshNuxtData()
}

const dismissMenu = async () => {
  // Add a little delay so that clicks on other menu buttons could be registered
  // before it's gone
  await sleep(200)
  isMoreExpanded.value = false
}

const dismissAction = async () => {
  // Add a little delay so that clicks on other menu buttons could be registered
  // before it's gone
  await sleep(200)
  isActionExpanded.value = false
}
</script>

<style>
.bounce-timing {
  transition-timing-function: cubic-bezier(0.22, 1.14, 0.69, 1.58);
}
</style>
