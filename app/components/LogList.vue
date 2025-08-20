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

const items: Ref<TimelineItem[]> = computed(() =>
  props.logs.map((log) => {
    const username = log.actor_username || 'Someone'
    const recipientUsername = log.recipient_username || 'Someone'
    const actionType = log.action_type
    const date = new Date(log.timestamp || 0).toISOString()
    const pointsChange = (log.points_after || 0) - (log.points_before || 0)
    const additionalContext = capitalize(log.additional_context || '')

    switch (actionType) {
      case 'change_points':
        return {
          username,
          date,
          action:
            `${pointsChange > 0 ? 'gave' : 'took'} ` +
            `${Math.abs(pointsChange)} points ${pointsChange > 0 ? 'to' : 'from'} ` +
            `${recipientUsername}`,
          description: `${recipientUsername} now has ${log.points_after || 0} points`,
          icon: pointsChange > 0 ? 'i-lucide-arrow-up' : 'i-lucide-arrow-down',
        }
      case 'mark_task_complete':
        return {
          username,
          date,
          action: 'marked a task complete',
          description: additionalContext,
          icon: 'i-lucide-thumbs-up',
        }
      case 'approve_task_complete':
        return {
          username,
          date,
          action: `approved task completion for ${recipientUsername}`,
          description:
            `${additionalContext} ${recipientUsername} now has ` +
            `${log.points_after || 0} points`,
          icon: 'i-lucide-thumbs-up',
        }
      case 'reject_task_complete':
        return {
          username,
          date,
          action: 'rejected task completion',
          description: additionalContext,
          icon: 'i-lucide-thumbs-down',
        }
      case 'update_task':
        return {
          username,
          date,
          action: 'updated a task',
          description: additionalContext,
          icon: 'i-lucide-pencil',
        }
      case 'create_task':
        return {
          username,
          date,
          action: 'created a task for ${recipientUsername}',
          description: additionalContext,
          icon: 'i-lucide-clipboard-list',
        }
      case 'delete_task':
        return {
          username,
          date,
          action: 'deleted a task',
          description: additionalContext,
          icon: 'i-lucide-x',
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
