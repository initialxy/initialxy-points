import { defineEventHandler, H3Event, createError } from 'h3'
import { getDb } from '../../../database'

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

  // Check if the reward exists
  const reward = await db.get<Reward>('SELECT * FROM rewards WHERE id = ?', [
    rewardId,
  ])

  if (reward == null) {
    throw createError({
      statusCode: 404,
      message: 'Reward not found or not authorized',
    })
  }

  // Only allowed if user is parent or child acting on their assigned reward
  if (user.role !== 'parent' && user.id !== reward.child_id) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden',
    })
  }

  if (!reward.is_redemption_requested) {
    throw createError({
      statusCode: 400,
      message: 'Reward redemption is not requested yet',
    })
  }

  await db.run(
    'UPDATE rewards SET is_redemption_requested = FALSE WHERE id = ?',
    rewardId
  )

  await logRewardAction(db, 'reject_redemption', user.id, reward)

  return {
    statusCode: 200,
    body: { message: 'Reward redemption rejected' },
  }
})
