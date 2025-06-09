<template>
  <div>
    <h1>Dashboard</h1>
    <template v-if="isParent">
      <ParentView />
    </template>
    <template v-else>
      <ChildView />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types'
const { user: sessionUser } = useUserSession()
const user = sessionUser as Ref<User | null>
const isParent = computed(() => user.value?.role === 'parent')
</script>
