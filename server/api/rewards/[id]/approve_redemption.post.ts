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

  // Verify user is a parent
  if (user.role !== 'parent') {
    throw createError({
      statusCode: 403,
      message: 'Forbidden',
    })
  }

  // Check if the reward exists (any parent can approve completions)
  const reward: Reward | undefined = db
    .prepare<[number], Reward>('SELECT * FROM rewards WHERE id = ?')
    .get(rewardId)

  if (reward == null) {
    throw createError({
      statusCode: 404,
      message: 'Reward not found or not authorized',
    })
  }

  const approveRedemption = db.transaction((r: Reward) => {
    if (r.recurrence_type === 'single-use') {
      // For single-use rewards, delete the reward after completion
      db.prepare<[number]>('DELETE FROM rewards WHERE id = ?').run(r.id)
    } else {
      // For perpetual rewards, reset the is_redemption_requested flag
      db.prepare<[number]>(
        'UPDATE rewards SET is_redemption_requested = FALSE WHERE id = ?'
      ).run(r.id)
    }

    // Get the child's current points before updating
    const child: ChildPoints | undefined = db
      .prepare<[number], ChildPoints>('SELECT points FROM users WHERE id = ?')
      .get(r.child_id)

    if (child == null) {
      throw createError({
        statusCode: 404,
        message: 'Child user not found',
      })
    }

    // Check if the child has enough points for this reward
    if (child.points < r.points) {
      throw createError({
        statusCode: 400,
        message: 'Child does not have enough points to redeem this reward',
        data: {
          requiredPoints: r.points,
          availablePoints: child.points,
        },
      })
    }

    db.prepare<[number, number]>(
      'UPDATE users SET points = points - ? WHERE id = ?'
    ).run(r.points, r.child_id)

    logRewardAction(
      db,
      'approve_redemption',
      user.id,
      r,
      child.points,
      child.points - r.points
    )
  })

  approveRedemption(reward)

  return {
    statusCode: 200,
    body: {
      message: 'Reward completion approved',
      pointsEarned: reward.points,
    },
  }
})
