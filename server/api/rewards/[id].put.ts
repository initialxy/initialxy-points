import { defineEventHandler, H3Event, readBody } from 'h3'
import { getDb } from '../../database'

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

  if (user.role !== 'parent') {
    return {
      statusCode: 403,
      body: { message: 'Forbidden' },
    }
  }

  const body = await readBody(event)
  const { description, points, recurrence_type } = body

  if (description == null || points == null || recurrence_type == null) {
    return {
      statusCode: 400,
      body: { message: 'Missing required fields' },
    }
  }

  if (recurrence_type !== 'single-use' && recurrence_type !== 'perpetual') {
    return {
      statusCode: 400,
      body: { message: 'Invalid reward type' },
    }
  }

  // Check if reward exists
  const rewardResult = await db.get<Reward>('SELECT * FROM rewards WHERE id = ?', [
    rewardId,
  ])

  if (rewardResult == null) {
    return {
      statusCode: 404,
      body: { message: 'Reward not found or not authorized' },
    }
  }

  const result = await db.run(
    'UPDATE rewards SET description = ?, points = ?, recurrence_type = ? WHERE id = ?',
    [description, points, recurrence_type, rewardId]
  )

  if (result.changes === 0) {
    return {
      statusCode: 404,
      body: { message: 'Reward not found or not authorized' },
    }
  }

  await logRewardAction(db, 'update_reward', user.id, rewardResult)

  return {
    reward: rewardResult,
  } as RewardResponse
})
