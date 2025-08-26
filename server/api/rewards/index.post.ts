import { defineEventHandler, H3Event, readBody, createError } from 'h3'
import { getDb } from '../../database'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const session = await requireUserSession(event)
  const user = session.user as User

  if (user.role !== 'parent') {
    throw createError({
      statusCode: 403,
      message: 'Forbidden',
    })
  }

  const body = await readBody(event)
  const { description, points, child_id, recurrence_type } = body

  if (!description || !points || !child_id || !recurrence_type) {
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

  const result = await db.run(
    'INSERT INTO rewards (description, points, child_id, recurrence_type, parent_id) VALUES (?, ?, ?, ?, ?)',
    [description, points, child_id, recurrence_type, user.id]
  )

  const rewardId = result.lastID as number

  const reward = {
    id: rewardId,
    description,
    points,
    child_id,
    recurrence_type,
    parent_id: user.id,
    is_redemption_requested: false,
  }

  await logRewardAction(db, 'create_reward', user.id, reward)

  return {
    reward,
  } as RewardResponse
})
