<template>
  <div class="space-y-4 max-w-100 mx-auto">
    <div v-if="sortedRewards.length === 0" class="text-center">
      <p class="text-muted">No reward yet</p>
    </div>
    <UCard
      v-else
      v-for="reward in sortedRewards"
      :key="reward.id"
      class="w-full"
      variant="subtle"
      :ui="{
        root: 'ring-indigo-200 dark:ring-indigo-800/50 bg-indigo-200/20 dark:bg-indigo-800/20',
      }"
    >
      <div class="flex justify-start items-start space-x-2">
        <p class="truncate text-indigo-700 dark:text-indigo-200 grow min-w-0">
          {{ reward.description }}
        </p>
        <UButton
          v-if="props.mode === 'parent'"
          size="sm"
          icon="i-lucide-x"
          color="error"
          variant="soft"
          @click="confirmDelete(reward)"
        />
      </div>
      <div class="flex justify-start items-start mt-2 space-x-2">
        <UBadge
          v-if="reward.is_redemption_requested"
          variant="subtle"
          color="primary"
          icon="i-lucide-bell-ring"
          class="size-6 justify-center"
        />
        <UBadge
          v-if="!reward.is_redemption_requested"
          variant="outline"
          color="neutral"
          icon="i-lucide-circle-dashed"
          class="size-6 justify-center ring-indigo-200 dark:ring-indigo-800/50 bg-indigo-200/20 dark:bg-indigo-800/20 text-indigo-700 dark:text-indigo-200"
        />
        <UBadge
          class="ring-indigo-200 dark:ring-indigo-800/50 bg-indigo-200/20 dark:bg-indigo-800/20 text-indigo-700 dark:text-indigo-200"
          :icon="getRecurrenceTypeIcon(reward)"
          color="neutral"
          variant="outline"
        >
          Points: {{ reward.points }}
        </UBadge>
        <div class="grow min-w-0 space-x-2 flex justify-end">
          <UButton
            v-if="reward.is_redemption_requested"
            size="sm"
            icon="i-lucide-thumbs-down"
            color="error"
            variant="soft"
            @click="emit('reject', reward)"
          />
          <UButton
            v-if="props.mode === 'parent' || !reward.is_redemption_requested"
            size="sm"
            icon="i-lucide-thumbs-up"
            color="success"
            variant="soft"
            @click="emit('complete', reward)"
          />
          <UButton
            v-if="props.mode === 'parent'"
            size="sm"
            icon="i-lucide-pencil"
            color="neutral"
            variant="soft"
            @click="emit('edit', reward)"
          />
        </div>
      </div>
    </UCard>

    <!-- Confirmation Modal -->
    <UModal
      v-model:open="isDeleteConfirmationModalOpen"
      title="Confirm Deletion"
      class="max-w-100"
    >
      <template #body>
        <p>Are you sure you want to delete this reward?</p>
      </template>
      <template #footer>
        <UButton @click="deleteConfirmed" color="error" icon="i-lucide-trash">
          Delete
        </UButton>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const emit = defineEmits<{
  (e: 'reject', reward: Reward): void
  (e: 'complete', reward: Reward): void
  (e: 'edit', reward: Reward): void
  (e: 'delete', reward: Reward): void
}>()

const props = defineProps<{
  rewards: Reward[]
  mode: 'parent' | 'child'
}>()

const isDeleteConfirmationModalOpen = ref(false)
const rewardToDelete = ref<Reward | null>(null)

const sortedRewards = computed(() => {
  return [...props.rewards].sort((a, b) => {
    // 1. Completed rewards go first
    if (a.is_redemption_requested && !b.is_redemption_requested) return -1
    if (!a.is_redemption_requested && b.is_redemption_requested) return 1

    // 2. Higher points go first
    if (b.points !== a.points) {
      return b.points - a.points
    }

    // 3. Alphabetical by description
    return a.description.localeCompare(b.description)
  })
})

const getRecurrenceTypeIcon = (reward: Reward) => {
  switch (reward.recurrence_type) {
    case 'single-use':
      return 'i-lucide-square-check-big'
    case 'perpetual':
      return 'i-lucide-recycle'
    default:
      return 'i-lucide-circle-question-mark'
  }
}

const confirmDelete = (reward: Reward) => {
  rewardToDelete.value = reward
  isDeleteConfirmationModalOpen.value = true
}

const deleteConfirmed = () => {
  if (rewardToDelete.value != null) {
    emit('delete', rewardToDelete.value)
    isDeleteConfirmationModalOpen.value = false
    rewardToDelete.value = null
  }
}
</script>
