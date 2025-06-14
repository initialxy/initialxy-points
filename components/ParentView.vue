<template>
  <div v-if="childrenData?.users.length ?? 0 > 0" class="space-y-4">
    <UCard v-for="child in childrenData?.users" :key="child.id">
      <div>
        <h2>{{ child.username }} - {{ child.points }} points</h2>
        <div v-for="task in getMarkedCompleteTasksForChild(child)">
          {{ task.description }} - {{ task.points }}
          <UButtonGroup>
            <UButton
              label="Approve"
              color="primary"
              @click="approveTask(task)"
            />
            <UButton label="Reject" color="info" @click="rejectTask(task)" />
          </UButtonGroup>
        </div>
      </div>
    </UCard>
  </div>
  <USkeleton v-else-if="status === 'pending'" />
  <p v-else-if="error" class="text-red-500">{{ error.message }}</p>
  <p v-else class="text-gray-500">No children found.</p>
</template>

<script setup lang="ts">
const {
  data: childrenData,
  error,
  status,
} = await useFetch<UsersResponse>('/api/users')
const { data: tasksData, refresh: tasksRefresh } =
  await useFetch<TasksResponse>('/api/tasks')

const getMarkedCompleteTasksForChild = (child: User) => {
  const tasks = tasksData.value?.tasks
  if (tasks == null) {
    return []
  }

  return tasks.filter(
    (task) => task.child_id === child.id && task.is_marked_complete
  )
}

const approveTask = async (task: Task) => {
  try {
    await $fetch(`/api/tasks/${task.id}/approve_complete`, {
      method: 'POST',
    })
    alert('Task completion approved')
    // Refresh tasks
    await tasksRefresh()
  } catch (err) {
    console.error('Error approving task:', err)
    alert('Failed to approve task')
  }
}

const rejectTask = async (task: Task) => {
  try {
    await $fetch(`/api/tasks/${task.id}/reject_complete`, {
      method: 'POST',
    })
    alert('Task completion rejected')
    // Refresh tasks
    await tasksRefresh()
  } catch (err) {
    console.error('Error rejecting task:', err)
    alert('Failed to reject task')
  }
}
</script>

<style scoped></style>
