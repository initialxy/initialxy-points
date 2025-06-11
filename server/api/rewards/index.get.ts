import { defineEventHandler, H3Event } from 'h3'
import { getDb } from '../../database'
import { Reward, User, RewardsResponse } from '~/types'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const session = await requireUserSession(event)
  const user = session.user as User

  const { child_id: childId } = getQuery(event)

  if (childId) {
    const rewards: Reward[] = await db.all(
      `
      SELECT rewards.*
      FROM rewards
      JOIN users ON rewards.parent_id = users.id
      WHERE users.id = ? AND users.role = 'parent'
      `,
      childId
    )
    return { rewards } as RewardsResponse
  } else {
    if (user.role !== 'child') {
      return {
        statusCode: 403,
        body: { message: 'Forbidden' },
      }
    }

    const rewards: Reward[] = await db.all(
      'SELECT * FROM rewards WHERE parent_id = ?',
      user.id
    )
    return { rewards } as RewardsResponse
  }
})
