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
const store = useStore()
const isParent = computed(() => store.user?.role === 'parent')
</script>
