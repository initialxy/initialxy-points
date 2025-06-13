<template>
  <UContainer>
    <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Dashboard</h1>
    <template v-if="isParent">
      <ParentView />
    </template>
    <template v-else>
      <ChildView />
    </template>
  </UContainer>
</template>

<script setup lang="ts">
import type { User } from '~/types'
const { user: sessionUser } = useUserSession()
const user = sessionUser as Ref<User | null>
const isParent = computed(() => user.value?.role === 'parent')
</script>
