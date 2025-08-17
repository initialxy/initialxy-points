<template>
  <div>
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
          @click="showCreateTaskModal = true"
          block
          class="w-10 h-10 rounded-full flex"
          :ui="{ leadingIcon: 'text-lg' }"
        />
      </div>
    </Transition>
    <Transition
      enter-active-class="duration-150 bounce-timing"
      enter-from-class="transform opacity-0 translate-y-10"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="duration-150 ease-in-out"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="transform opacity-0 translate-y-10"
    >
      <div v-if="store.actionableUser != null" key="action-button">
        <UButton
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
    </Transition>

    <UModal
      v-model:open="showCreateTaskModal"
      title="New Task"
      class="max-w-100"
    >
      <template #body>
        <UForm
          id="new-task-form"
          :schema="newTaskSchema"
          :state="newTaskState"
          class="space-y-4"
          @submit="newTaskSubmit"
        >
          <UFormField name="description">
            <UInput
              v-model="newTaskState.description"
              type="text"
              placeholder="Description"
              class="w-full"
            />
          </UFormField>
          <UFormField name="points">
            <UInput
              v-model="newTaskState.points"
              type="number"
              placeholder="Points"
              class="w-full"
            />
          </UFormField>
          <UFormField name="taskType">
            <USelect
              v-model="newTaskState.taskType"
              :items="taskTypeItems"
              class="w-full"
            />
          </UFormField>
        </UForm>
      </template>
      <template #footer>
        <div>
          <UButton
            form="new-task-form"
            type="submit"
            icon="i-lucide-check"
            color="primary"
            variant="solid"
            class="w-full"
          >
            Create
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod'

const store = useStore()
const toast = useToast()

const isActionExpanded = ref(false)
const showCreateTaskModal = ref(false)

const newTaskState: Ref<{
  description: string
  points: number | null
  taskType: 'throw-away' | 'perpetual'
}> = ref({
  description: '',
  points: null,
  taskType: 'throw-away',
})

const newTaskSchema = z.object({
  description: z.string().min(4, 'Must be at least 4 characters'),
  points: z.number().min(0, 'Must be at least 0').nullable(),
  taskType: z.enum(['throw-away', 'perpetual']),
})

const taskTypeItems = ref([
  { value: 'throw-away', label: 'Throw Away' },
  { value: 'perpetual', label: 'Perpetual' },
])

const newTaskSubmit = async () => {
  try {
    await $fetch('/api/tasks', {
      method: 'POST',
      body: {
        description: newTaskState.value.description,
        points: newTaskState.value.points || 0,
        child_id: store.actionableUser?.id || 0,
        task_type: newTaskState.value.taskType,
      },
    })

    toast.add({
      title: 'Task created successfully',
      color: 'success',
      progress: false,
    })

    // Close modal and reset form
    showCreateTaskModal.value = false
    newTaskState.value = {
      description: '',
      points: 0,
      taskType: 'throw-away',
    }

    await refreshNuxtData()
  } catch (error: any) {
    toast.add({
      title: error.data?.message || 'Failed to create task',
      color: 'error',
      progress: false,
    })
  }
}

const dismissAction = async () => {
  // Add a little delay so that clicks on other menu buttons could be registered
  // before it's gone
  await sleep(200)
  isActionExpanded.value = false
}
</script>

<style scoped>
.bounce-timing {
  transition-timing-function: cubic-bezier(0.22, 1.14, 0.69, 1.58);
}
</style>
