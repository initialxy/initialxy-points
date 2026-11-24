import type { H3Event } from 'h3'
import { defineEventHandler, createError } from 'h3'
import { getDb } from '../../../database'

type ChildPoints = Pick<User, 'points'>

export default defineEventHandler(async (event: H3Event) => {
  const db = getDb()
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
  const reward: Reward | undefined = db
    .prepare<[number], Reward>('SELECT * FROM rewards WHERE id = ?')
    .get(rewardId)

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

  if (reward.is_redemption_requested) {
    throw createError({
      statusCode: 400,
      message: 'Reward redemption is already requested',
    })
  }

  // Check if the child has enough points for this reward
  const child: ChildPoints | undefined = db
    .prepare<[number], ChildPoints>('SELECT points FROM users WHERE id = ?')
    .get(reward.child_id)

  if (child == null || child.points < reward.points) {
    throw createError({
      statusCode: 400,
      message: 'Child does not have enough points to redeem this reward',
      data: {
        requiredPoints: reward.points,
        availablePoints: child == null ? 0 : child.points,
      },
    })
  }

  const requestRedemption = db.transaction((r: Reward) => {
    db.prepare<[number]>(
      'UPDATE rewards SET is_redemption_requested = TRUE WHERE id = ?'
    ).run(r.id)

    logRewardAction(db, 'request_redemption', user.id, r)
  })

  requestRedemption(reward)

  return {
    statusCode: 200,
    body: { message: 'Reward redemption requested. Awaiting parent approval.' },
  }
})
