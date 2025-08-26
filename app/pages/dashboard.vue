<template>
  <div>
    <ParentView v-if="user?.role === 'parent'" @updatePoints="refresh" />
    <ChildView v-else-if="user?.role === 'child'" />
    <hr
      class="max-w-150 mx-auto bg-neutral-200 dark:bg-neutral-800 border-none h-px my-6"
    />
    <LogList :logs="logs?.logs || []" v-if="user != null" />
  </div>
</template>

<script setup lang="ts">
const MAX_LOG_LIMIT = 20

const { user: sessionUser } = useUserSession()
const user = sessionUser as Ref<User | null>

const query =
  user.value?.role === 'parent'
    ? { limit: MAX_LOG_LIMIT }
    : { limit: MAX_LOG_LIMIT, recipient_id: user.value?.id || 0 }

const { data: logs, refresh: refreshLogs } = await useLazyFetch<LogsResponse>(
  '/api/logs',
  { query }
)

const refresh = async (_) => {
  await refreshLogs()
}
</script>
