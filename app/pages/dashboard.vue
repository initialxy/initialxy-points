<template>
  <div>
    <ParentView v-if="user?.role === 'parent'" @update-points="refreshLogs" />
    <ChildView v-else-if="user?.role === 'child'" />
    <hr
      class="max-w-100 mx-auto bg-neutral-200 dark:bg-neutral-800 border-none h-px my-6"
    />
    <LogList :logs="logs?.logs || []" v-if="user != null" />
  </div>
</template>

<script setup lang="ts">
const MAX_LOG_LIMIT = 20

const { user: sessionUser } = useUserSession()
const user = sessionUser as Ref<User | null>

const { data: logs, refresh: refreshLogs } = await useFetch<LogsResponse>(
  '/api/logs',
  {
    query: { limit: MAX_LOG_LIMIT },
  }
)
</script>
