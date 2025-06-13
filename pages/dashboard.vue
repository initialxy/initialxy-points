<template>
  <ParentView v-if="isParent" />
  <ChildView v-else />
</template>

<script setup lang="ts">
import type { User } from '~/types'
const { user: sessionUser } = useUserSession()
const user = sessionUser as Ref<User | null>
const isParent = computed(() => user.value?.role === 'parent')
</script>
