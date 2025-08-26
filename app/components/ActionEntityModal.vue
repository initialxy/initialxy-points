<template>
  <UModal v-model:open="isOpen" :title="title" class="max-w-150">
    <template #body>
      <UForm
        id="action-item-form"
        :schema="actionItemSchema"
        :state="actionItem"
        class="space-y-4"
        @submit="handleSubmit"
      >
        <UFormField name="description">
          <UInput
            v-model="actionItem.description"
            type="text"
            placeholder="Description"
            class="w-full"
          />
        </UFormField>
        <UFormField name="points">
          <UInput
            v-model="actionItem.points"
            type="number"
            placeholder="Points"
            class="w-full"
          />
        </UFormField>
        <UFormField name="recurrenceType">
          <USelect
            v-model="actionItem.recurrenceType"
            :items="recurrenceTypeItems"
            class="w-full clickable-lg"
          />
        </UFormField>
      </UForm>
    </template>
    <template #footer>
      <div>
        <UButton
          form="action-item-form"
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
  actionItem: PartialActionItem | null
}>()

const actionItem: Ref<PartialActionItem> = defineModel<PartialActionItem>(
  'actionItem',
  {
    default: { description: '', points: null, recurrenceType: 'single-use' },
  }
)

const isOpen: Ref<boolean> = defineModel('open', {
  default: false,
})

const emit = defineEmits<{
  (e: 'submit'): void
}>()

const actionItemSchema = z.object({
  description: z.string().min(4, 'Must be at least 4 characters'),
  points: z.number().min(0, 'Must be at least 0').nullable(),
  recurrenceType: z.enum(['single-use', 'perpetual']),
})

const recurrenceTypeItems = ref(
  ['single-use', 'perpetual'].map((value) => ({
    value,
    label: getReadableRecurrenceType(value),
  }))
)

const handleSubmit = () => {
  emit('submit')
}
</script>
