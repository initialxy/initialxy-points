<template>
  <UCard variant="subtle">
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField
        name="username"
        type="text"
        v-if="!rememberedUsersState.some(user => user.isSelected)"
      >
        <UInput placeholder="Who?" v-model="state.username" class="w-full" />
      </UFormField>

      <ul v-if="rememberedUsersState.length > 0" class="w-full">
        <li v-for="user in rememberedUsersState" :key="user.username" class="mb-6">
          <input
            type="checkbox"
            :id="'option-' + user.username" value=""
            class="hidden peer"
            v-model="user.isSelected"
            @change="selectUser(user)"
          />
          <label
            :for="'option-' + user.username"
            class="inline-flex items-center justify-between p-5 w-full rounded-md border-0 bg-slate-100 dark:bg-slate-800 ring ring-inset ring-accented peer-checked:ring-primary">
            <div class="block">
              {{ user.username }}
            </div>
          </label>
        </li>
      </ul>

      <UFormField name="passcode">
        <UInput placeholder="Passcode" v-model="state.passcode" type="password" class="w-full" />
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
import { useLocalStorage } from '@vueuse/core'

const MAX_USERS_TO_REMEMBER = 3

type RememberedUserState = {
  username: string
  isSelected: boolean
}

const store = useStore()
const toast = useToast()

const rememberedUsers = useLocalStorage<RememberedUser[]>('rememberedUsers', [])
const rememberedUsersState = ref<RememberedUserState[]>([])
rememberedUsersState.value = rememberedUsers.value.map(user => ({
  username: user.username,
  isSelected: false,
}))

const state = reactive({
  username: '',
  passcode: '',
  isLoading: false,
})

const schema = z.object({
  username: z.string(),
  passcode: z.string().min(3, 'Must be at least 3 characters'),
})

// Fill form with user data
const selectUser = (selectedUser: RememberedUserState) => {
  state.username = selectedUser.username
  rememberedUsersState.value = rememberedUsersState.value.map(user => {
    user.isSelected = user.username === selectedUser.username
    return user
  })
}

const onSubmit = async () => {
  state.isLoading = true

  try {
    await store.login(state.username, state.passcode)
    const { user: sessionUser } = useUserSession()
    const user = sessionUser as Ref<User | null>
    if (user.value != null) {
      const newUser = {username: user.value.username, timestamp: Date.now()}
      const prevUsers = rememberedUsers.value
        .filter(u => u.username !== newUser.username)
      rememberedUsers.value = [newUser, ...prevUsers]
        .slice(0, MAX_USERS_TO_REMEMBER)
    }
    await navigateTo('/dashboard')
  } catch (error) {
    toast.add({ title: 'Something went wrong', progress: false })
  } finally {
    state.isLoading = false
  }
}
</script>

<style scoped>
</style>
