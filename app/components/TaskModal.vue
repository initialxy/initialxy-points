<template>
  <UModal v-model:open="isOpen" :title="title" class="max-w-100">
    <template #body>
      <UForm
        id="task-form"
        :schema="taskSchema"
        :state="task"
        class="space-y-4"
        @submit="handleSubmit"
      >
        <UFormField name="description">
          <UInput
            v-model="task.description"
            type="text"
            placeholder="Description"
            class="w-full"
          />
        </UFormField>
        <UFormField name="points">
          <UInput
            v-model="task.points"
            type="number"
            placeholder="Points"
            class="w-full"
          />
        </UFormField>
        <UFormField name="taskType">
          <USelect
            v-model="task.taskType"
            :items="taskTypeItems"
            class="w-full"
          />
        </UFormField>
      </UForm>
    </template>
    <template #footer>
      <div>
        <UButton
          form="task-form"
          type="submit"
          icon="i-lucide-check"
          color="primary"
          variant="solid"
          class="w-full"
        >
          {{ submitButtonText }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import * as z from 'zod'

defineProps<{
  open: boolean
  title: string
  submitButtonText: string
  task: PartialTask | null
}>()

const task: Ref<PartialTask> = defineModel<PartialTask>('task', {
  default: { description: '', points: null, taskType: 'throw-away' },
})

const isOpen: Ref<boolean> = defineModel('open', {
  default: false,
})

const emit = defineEmits<{
  (e: 'submit'): void
}>()

const taskSchema = z.object({
  description: z.string().min(4, 'Must be at least 4 characters'),
  points: z.number().min(0, 'Must be at least 0').nullable(),
  taskType: z.enum(['throw-away', 'perpetual']),
})

const taskTypeItems = ref([
  { value: 'throw-away', label: 'Throw Away' },
  { value: 'perpetual', label: 'Perpetual' },
])

const handleSubmit = () => {
  emit('submit')
}
</script>
