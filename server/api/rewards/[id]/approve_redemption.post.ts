import { defineEventHandler, H3Event } from 'h3'
import { getDb } from '../../../database'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const session = await requireUserSession(event)
  const user = session.user as User
  const rewardId = validateId(
    parseInt(event.context.params?.id ?? '0') as number
  )

  if (rewardId == null) {
    return {
      statusCode: 400,
      body: { message: 'Invalid reward ID' },
    }
  }

  // Verify user is a parent
  if (user.role !== 'parent') {
    return {
      statusCode: 403,
      body: { message: 'Forbidden' },
    }
  }

  // Check if the reward exists (any parent can approve completions)
  const reward = await db.get<Reward>('SELECT * FROM rewards WHERE id = ?', [
    rewardId,
  ])

  if (!reward) {
    return {
      statusCode: 404,
      body: { message: 'Reward not found or not authorized' },
    }
  }

  if (reward.recurrence_type === 'single-use') {
    // For single-use rewards, delete the reward after completion
    await db.run('DELETE FROM rewards WHERE id = ?', rewardId)
  } else {
    // For perpetual rewards, reset the is_redemption_requested flag
    await db.run(
      'UPDATE rewards SET is_redemption_requested = FALSE WHERE id = ?',
      rewardId
    )
  }

  // Get the child's current points before updating
  const child = await db.get<User>('SELECT points FROM users WHERE id = ?', [
    reward.child_id,
  ])

  if (!child) {
    return {
      statusCode: 404,
      body: { message: 'Child user not found' },
    }
  }

  // Check if the child has enough points for this reward
  if (child.points < reward.points) {
    return {
      statusCode: 400,
      body: {
        message: 'Child does not have enough points to redeem this reward',
        requiredPoints: reward.points,
        availablePoints: child.points,
      },
    }
  }

  await db.run('UPDATE users SET points = points - ? WHERE id = ?', [
    reward.points,
    reward.child_id,
  ])

  await logRewardAction(
    db,
    'approve_redemption',
    user.id,
    reward,
    child.points,
    child.points + reward.points
  )

  return {
    statusCode: 200,
    body: {
      message: 'Reward completion approved',
      pointsEarned: reward.points,
    },
  }
})
