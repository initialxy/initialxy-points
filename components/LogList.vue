<template>
  <UTimeline
    :items="items"
    size="xs"
    :ui="{
      date: 'float-end ms-1',
      description: 'px-3 py-2 ring ring-default mt-2 rounded-md text-default',
    }"
    class="max-w-100 mx-auto"
  >
    <template #title="{ item }">
      <span>{{ item.username }}</span>
      <span class="font-normal text-muted">&nbsp;{{ item.action }}</span>
    </template>

    <template #date="{ item }">
      {{ useTimeAgo(new Date(item.date || '')) }}
    </template>
  </UTimeline>
</template>

<script setup lang="ts">
import type { TimelineItem } from '@nuxt/ui'

const props = defineProps<{
  logs: Log[]
}>()

const { data: allUsers } = await useFetch<UsersResponse>('/api/users', {
  query: { role: 'all' },
})

const getUserById = (id: number): User | null => {
  return allUsers?.value?.users.find((user) => user.id === id) || null
}

const getUsername = (userId: number): string => {
  const user = getUserById(userId)
  return user ? user.username : ''
}

const items: Ref<TimelineItem[]> = computed(() =>
  props.logs.map((log) => {
    const username = getUsername(log.actor_id)
    const actionType = log.action_type
    const date = new Date(log.timestamp || 0).toISOString()

    switch (actionType) {
      case 'change_points':
        const pointsChange = (log.points_after || 0) - (log.points_before || 0)
        const action =
          `${pointsChange > 0 ? 'gave' : 'removed'} ` +
          `${Math.abs(pointsChange)} points ${pointsChange > 0 ? 'to' : 'from'} ` +
          `${getUsername(log.recipient_id || 0)}`
        const description = `${getUsername(log.recipient_id || 0)} now has ${log.points_after || 0} points`
        const icon =
          pointsChange > 0 ? 'i-lucide-arrow-up' : 'i-lucide-arrow-down'
        return {
          username,
          date,
          action,
          description,
          icon,
        }
    }

    return {
      username,
      date,
      action: actionType,
    }
  })
)
</script>
