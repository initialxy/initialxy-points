import { defineEventHandler, H3Event } from 'h3'
import { getDb } from '../../../database'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const session = await requireUserSession(event)
  const user = session.user as User
  const rewardId = validateId(parseInt(event.context.params?.id ?? '0') as number)

  if (rewardId == null) {
    return {
      statusCode: 400,
      body: { message: 'Invalid reward ID' },
    }
  }

  // Check if the reward exists
  const reward = await db.get<Reward>('SELECT * FROM rewards WHERE id = ?', [rewardId])

  if (reward == null) {
    return {
      statusCode: 404,
      body: { message: 'Reward not found or not authorized' },
    }
  }

  // Only allowed if user is parent or child acting on their assigned reward
  if (user.role !== 'parent' && user.id !== reward.child_id) {
    return {
      statusCode: 403,
      body: { message: 'Forbidden' },
    }
  }

  if (reward.is_redemption_requested) {
    return {
      statusCode: 400,
      body: { message: 'Reward redemption is already requested' },
    }
  }

  // Check if the child has enough points for this reward
  const child = await db.get<User>('SELECT points FROM users WHERE id = ?', [
    reward.child_id,
  ])

  if (!child || child.points < reward.points) {
    return {
      statusCode: 400,
      body: {
        message: 'Child does not have enough points to redeem this reward',
        requiredPoints: reward.points,
        availablePoints: child ? child.points : 0
      },
    }
  }

  await db.run(
    'UPDATE rewards SET is_redemption_requested = TRUE WHERE id = ?',
    rewardId
  )

  await logRewardAction(db, 'request_redemption', user.id, reward)

  return {
    statusCode: 200,
    body: { message: 'Reward redemption requested. Awaiting parent approval.' },
  }
})
