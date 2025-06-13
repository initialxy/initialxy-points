<template>
  <UCard variant="subtle" class="m-8 ml-auto mr-auto">
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Who?" name="username" type="text">
        <UInput v-model="state.username" class="w-full" />
      </UFormField>
      <UFormField label="Passcode" name="passcode">
        <UInput v-model="state.passcode" type="password" class="w-full" />
      </UFormField>
      <UButton
        type="submit"
        icon="i-lucide-log-in"
        size="md"
        :disabled="state.isLoading"
        loading-auto
      >
        Login
      </UButton>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import * as z from 'zod'

const store = useStore()
const toast = useToast()

const state = reactive({
  username: '',
  passcode: '',
  isLoading: false,
})

const schema = z.object({
  username: z.string(),
  passcode: z.string().min(3, 'Must be at least 3 characters'),
})

type Schema = z.output<typeof schema>

const onSubmit = async () => {
  state.isLoading = true

  try {
    await store.login(state.username, state.passcode)
    await navigateTo('/dashboard')
  } catch (error) {
    toast.add({ title: 'Something went wrong', progress: false })
  } finally {
    state.isLoading = false
  }
}
</script>

<style scoped></style>
