import { defineEventHandler, H3Event } from 'h3'
import { getDb } from '../../database'

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

  if (user.role !== 'parent') {
    return {
      statusCode: 403,
      body: { message: 'Forbidden' },
    }
  }

  // Get the reward to log before deletion
  const rewardResult = await db.get<Reward>(
    'SELECT * FROM rewards WHERE id = ?',
    [rewardId]
  )

  if (rewardResult == null) {
    return {
      statusCode: 404,
      body: { message: 'Reward not found or not authorized' },
    }
  }

  const result = await db.run('DELETE FROM rewards WHERE id = ?', [rewardId])

  if (result.changes === 0) {
    return {
      statusCode: 404,
      body: { message: 'Reward not found or not authorized' },
    }
  }

  await logRewardAction(db, 'delete_reward', user.id, rewardResult)

  return {
    statusCode: 204,
    body: null,
  }
})
