<template>
  <UCard variant="subtle">
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField
        name="username"
        type="text"
        v-if="!isAnyUserSelected"
      >
        <UInput placeholder="Who?" v-model="state.username" class="w-full" />
      </UFormField>

      <ul v-if="rememberedUsersState.length > 0" class="w-full">
        <li
          v-for="user in rememberedUsersState"
          :key="user.username" class="mb-4"
          :class="{'hidden': isAnyUserSelected && !user.isSelected}"
        >
          <UCheckbox
            variant="card"
            default-value
            indicator="hidden" 
            :label="user.username"
            class="bg-neutral-100 dark:bg-neutral-800"
            v-model="user.isSelected"
            @change="selectUser(user)"
            :ui="{'wrapper': 'text-left'}"
          />
        </li>
      </ul>

      <UFormField name="password">
        <UInput placeholder="Password" v-model="state.password" type="password" class="w-full" />
      </UFormField>
      <div>
        <UButton
          type="submit"
          icon="i-lucide-log-in"
          size="md"
          :disabled="state.isLoading"
          loading-auto
        >
          Login
        </UButton>
        <UButton
          v-if="isAnyUserSelected"
          icon="i-lucide-skip-back"
          color="secondary"
          variant="soft"
          size="md"
          class="float-right"
          @click="back"
        >
          Back
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import * as z from 'zod'

type RememberedUserState = {
  username: string
  isSelected: boolean
}

const store = useStore()
const toast = useToast()

const rememberedUsers = store.useRememberedUsers()
const rememberedUsersState = ref<RememberedUserState[]>([])
rememberedUsersState.value = rememberedUsers.value.map(user => ({
  username: user.username,
  isSelected: false,
}))

const state = reactive({
  username: '',
  password: '',
  isLoading: false,
})

const schema = z.object({
  username: z.string(),
  password: z.string().min(3, 'Must be at least 3 characters'),
})

const isAnyUserSelected =
  computed(() => rememberedUsersState.value.some(user => user.isSelected))

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
    await store.login(state.username, state.password)
    await navigateTo('/dashboard')
  } catch (error) {
    toast.add({ title: 'Something went wrong', progress: false })
  } finally {
    state.isLoading = false
  }
}

const back = () => {
  state.username = ''
  rememberedUsersState.value = rememberedUsersState.value.map(user => {
    user.isSelected = false
    return user
  })
}
</script>

<style scoped>
</style>
