import { defineEventHandler, H3Event, readBody } from 'h3'
import { getDb } from '../../database'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const session = await requireUserSession(event)
  const user = session.user as User

  if (user.role !== 'parent') {
    return {
      statusCode: 403,
      body: { message: 'Forbidden' },
    }
  }

  const body = await readBody(event)
  const { description, points, child_id, recurrence_type } = body

  if (!description || !points || !child_id || !recurrence_type) {
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
    is_marked_complete: false,
  }

  await logRewardAction(db, 'create_reward', user.id, reward)

  return {
    reward,
  } as RewardResponse
})
