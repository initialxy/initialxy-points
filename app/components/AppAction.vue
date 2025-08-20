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

    <TaskModal
      v-model:open="showCreateTaskModal"
      v-model:task="newTaskState"
      title="New Task"
      submit-button-text="Create"
      @submit="newTaskSubmit"
    />
  </div>
</template>

<script setup lang="ts">
const store = useStore()
const toast = useToast()

const isActionExpanded = ref(false)
const showCreateTaskModal = ref(false)

const newTaskState: Ref<PartialTask> = ref({
  description: '',
  points: null,
  taskType: 'single-use',
})

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
      points: null,
      taskType: 'single-use',
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
