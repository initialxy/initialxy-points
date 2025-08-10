<template>
  <span class="text-neutral-500">
    <span class="text-primary-500">{{ getUsername(props.log.actor_id) }}</span>
    {{ action }}
    <span class="text-info-500">{{ info }}</span>
    {{ additional }}
  </span>
</template>

<script lang="ts" setup>
const ACTION_CHANGE_POINTS = 'change_points'

const props = defineProps<{
  log: Log
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

const action = computed(() => {
  switch (props.log.action_type) {
    case ACTION_CHANGE_POINTS:
      const pointsChange =
        (props.log.points_after || 0) - (props.log.points_before || 0)
      return pointsChange > 0 ? 'added' : 'reduced'
    default:
      return props.log.action_type
  }
})

const info = computed(() => {
  switch (props.log.action_type) {
    case ACTION_CHANGE_POINTS:
      return `${getUsername(props.log.recipient_id || 0)}'s`
    default:
      return ''
  }
})

const additional = computed(() => {
  switch (props.log.action_type) {
    case ACTION_CHANGE_POINTS:
      return `points from ${props.log.points_before} to ${props.log.points_after}`
    default:
      return ''
  }
})
</script>
