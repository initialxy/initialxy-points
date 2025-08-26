import { defineEventHandler, H3Event, readBody, createError } from 'h3'
import { getDb } from '../../database'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const session = await requireUserSession(event)
  const user = session.user as User

  const rewardId = validateId(
    parseInt(event.context.params?.id ?? '0') as number
  )
  if (rewardId == null) {
    throw createError({
      statusCode: 400,
      message: 'Invalid reward ID',
    })
  }

  if (user.role !== 'parent') {
    throw createError({
      statusCode: 403,
      message: 'Forbidden',
    })
  }

  const body = await readBody(event)
  const { description, points, recurrence_type } = body

  if (description == null || points == null || recurrence_type == null) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields',
    })
  }

  if (recurrence_type !== 'single-use' && recurrence_type !== 'perpetual') {
    throw createError({
      statusCode: 400,
      message: 'Invalid reward type',
    })
  }

  // Check if reward exists
  const rewardResult = await db.get<Reward>(
    'SELECT * FROM rewards WHERE id = ?',
    [rewardId]
  )

  if (rewardResult == null) {
    throw createError({
      statusCode: 404,
      message: 'Reward not found or not authorized',
    })
  }

  const result = await db.run(
    'UPDATE rewards SET description = ?, points = ?, recurrence_type = ? WHERE id = ?',
    [description, points, recurrence_type, rewardId]
  )

  if (result.changes === 0) {
    throw createError({
      statusCode: 404,
      message: 'Reward not found or not authorized',
    })
  }

  const updatedReward = await db.get<Reward>(
    'SELECT * FROM rewards WHERE id = ?',
    [rewardId]
  )

  if (updatedReward == null) {
    throw createError({
      statusCode: 404,
      message: 'Reward not found or not authorized',
    })
  }

  await logRewardAction(db, 'update_reward', user.id, updatedReward)

  return {
    reward: updatedReward,
  } as RewardResponse
})
