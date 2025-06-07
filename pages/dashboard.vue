<template>
  <div>
    <h1>Dashboard</h1>
    <div v-if="status === 'pending'">Loading...</div>
    <div v-else-if="error">{{ error.message }}</div>
    <div v-else>
      <template v-if="isParent">
        <ParentView />
      </template>
      <template v-else>
        <ChildView />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { onMounted, ref } from 'vue'

const { user } = useAuth()
const status = ref<'idle' | 'pending' | 'success' | 'error'>('pending')
const error = ref(null)
const isParent = ref(false)

onMounted(async () => {
  try {
    // Determine if user is parent or child
    // In a real implementation, this would check user roles or other criteria
    isParent.value = user.value?.role === 'parent'
    status.value = 'success'
  } catch (err) {
    error.value = err
    status.value = 'error'
  }
})
</script>
