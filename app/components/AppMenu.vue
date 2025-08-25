<template>
  <div>
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
          class="w-10 h-10 rounded-full flex"
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
      <div v-if="isMoreExpanded" key="change-credentials-button">
        <UButton
          icon="i-lucide-square-asterisk"
          color="info"
          variant="solid"
          size="xl"
          @click="showCredentialsModal = true"
          block
          class="w-10 h-10 rounded-full flex"
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
          class="w-10 h-10 rounded-full flex"
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

    <UModal
      v-model:open="showCredentialsModal"
      title="Change Credentials"
      class="max-w-100"
    >
      <template #body>
        <UForm
          id="change-credentials-form"
          :schema="credentialsSchema"
          :state="credentialsFormState"
          class="space-y-4"
          @submit="changeCredentialsSubmit"
        >
          <UFormField name="username">
            <UInput
              v-model="credentialsFormState.username"
              type="text"
              placeholder="Username"
              class="w-full"
            />
          </UFormField>
          <UFormField name="currentPassword">
            <UInput
              v-model="credentialsFormState.currentPassword"
              type="password"
              placeholder="Current password"
              class="w-full"
            />
          </UFormField>
          <UFormField name="newPassword">
            <UInput
              v-model="credentialsFormState.newPassword"
              type="password"
              placeholder="New password"
              class="w-full"
            />
          </UFormField>
          <UFormField name="confirmNewPassword">
            <UInput
              v-model="credentialsFormState.confirmNewPassword"
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
            form="change-credentials-form"
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
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod'

const { user: sessionUser, fetch: refreshSession } = useUserSession()
const user = sessionUser as Ref<User | null>

const store = useStore()
const toast = useToast()

const isMoreExpanded = ref(false)
const showCredentialsModal = ref(false)

const credentialsFormState = ref({
  username: user.value?.username || '',
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
})

const credentialsSchema = z.object({
  username: z.string().min(2, 'Must be at least 2 characters'),
  currentPassword: z.string().min(4, 'Must be at least 4 characters'),
  newPassword: z.string().min(4, 'Must be at least 4 characters'),
  confirmNewPassword: z.string().min(4, 'Must be at least 4 characters'),
})

const logoutClicked = async () => {
  await store.logout()
  await sleep(200)
  await navigateTo('/login')
}

const changeCredentialsSubmit = async () => {
  // Check if new passwords match
  if (
    credentialsFormState.value.newPassword !==
    credentialsFormState.value.confirmNewPassword
  ) {
    toast.add({
      title: 'New passwords do not match',
      color: 'error',
      progress: false,
    })
    return
  }

  try {
    await $fetch('/api/auth/credentials', {
      method: 'POST',
      body: {
        username: credentialsFormState.value.username,
        currentPassword: credentialsFormState.value.currentPassword,
        newPassword: credentialsFormState.value.newPassword,
      },
    })

    toast.add({
      title: 'Credentials changed successfully',
      color: 'success',
      progress: false,
    })

    // Close modal and reset form
    showCredentialsModal.value = false
    await refreshSession()
    credentialsFormState.value = {
      username: user.value?.username || '',
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

// @click throws a type error if you don't wrap it
const refresh = async () => {
  await refreshNuxtData()
}

const dismissMenu = async () => {
  // Add a little delay so that clicks on other menu buttons could be registered
  // before it's gone
  await sleep(200)
  isMoreExpanded.value = false
}
</script>

<style scoped></style>
