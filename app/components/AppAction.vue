<template>
  <div>
    <Transition
      enter-active-class="duration-150 bounce-timing"
      enter-from-class="transform opacity-0 translate-y-20"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="duration-150 ease-in-out"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="transform opacity-0 translate-y-20"
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
      enter-active-class="duration-150 bounce-timing delay-100"
      enter-from-class="transform opacity-0 translate-y-10"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="duration-150 ease-in-out"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="transform opacity-0 translate-y-10"
    >
      <div
        v-if="store.actionableUser != null && isActionExpanded"
        key="create-reward-button"
      >
        <UButton
          icon="i-lucide-gift"
          color="info"
          variant="solid"
          size="xl"
          @click="showCreateRewardModal = true"
          block
          class="w-10 h-10 rounded-full flex mt-2"
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

    <ActionEntityModal
      v-model:open="showCreateTaskModal"
      v-model:actionItem="newTaskState"
      title="New Task"
      submit-button-text="Create"
      @submit="newTaskSubmit"
    />

    <ActionEntityModal
      v-model:open="showCreateRewardModal"
      v-model:actionItem="newRewardState"
      title="New Reward"
      submit-button-text="Create"
      @submit="newRewardSubmit"
    />
  </div>
</template>

<script setup lang="ts">
const store = useStore()
const toast = useToast()

const isActionExpanded = ref(false)
const showCreateTaskModal = ref(false)
const showCreateRewardModal = ref(false)

const newTaskState: Ref<PartialActionItem> = ref({
  description: '',
  points: null,
  recurrenceType: 'single-use',
})

const newRewardState: Ref<PartialActionItem> = ref({
  description: '',
  points: null,
  recurrenceType: 'single-use',
})

const newTaskSubmit = async () => {
  try {
    await $fetch('/api/tasks', {
      method: 'POST',
      body: {
        description: newTaskState.value.description,
        points: newTaskState.value.points || 0,
        child_id: store.actionableUser?.id || 0,
        recurrence_type: newTaskState.value.recurrenceType,
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
      points: null,
      recurrenceType: 'single-use',
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

const newRewardSubmit = async () => {
  try {
    await $fetch('/api/rewards', {
      method: 'POST',
      body: {
        description: newRewardState.value.description,
        points: newRewardState.value.points || 0,
        child_id: store.actionableUser?.id || 0,
        recurrence_type: newRewardState.value.recurrenceType,
      },
    })

    toast.add({
      title: 'Reward created successfully',
      color: 'success',
      progress: false,
    })

    // Close modal and reset form
    showCreateRewardModal.value = false
    newRewardState.value = {
      description: '',
      points: null,
      recurrenceType: 'single-use',
    }

    await refreshNuxtData()
  } catch (error: any) {
    toast.add({
      title: error.data?.message || 'Failed to create reward',
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

<style scoped></style>
