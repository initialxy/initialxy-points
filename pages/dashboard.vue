<template>
  <ParentView v-if="user?.role === 'parent'" />
  <ChildView v-else-if="user?.role === 'child'" />
</template>

<script setup lang="ts">
const { user: sessionUser } = useUserSession()
const user = sessionUser as Ref<User | null>
</script>
