import type { H3Event } from 'h3'
import { defineEventHandler, createError } from 'h3'
import { getDb } from '../../database'

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

  if (user.role !== 'parent') {
    throw createError({
      statusCode: 403,
      message: 'Forbidden',
    })
  }

  // Get the reward to log before deletion
  const rewardResult: Reward | undefined = db
    .prepare<[number], Reward>('SELECT * FROM rewards WHERE id = ?')
    .get(rewardId)

  if (rewardResult == null) {
    throw createError({
      statusCode: 404,
      message: 'Reward not found or not authorized',
    })
  }

  const deleteRewardAndLog = db.transaction((reward: Reward) => {
    const result = db
      .prepare<[number]>('DELETE FROM rewards WHERE id = ?')
      .run(reward.id)

    if (result.changes === 0) {
      throw createError({
        statusCode: 404,
        message: 'Reward not found or not authorized',
      })
    }

    logRewardAction(db, 'delete_reward', user.id, reward)
  })

  deleteRewardAndLog(rewardResult)

  return {
    statusCode: 204,
    body: null,
  }
})
