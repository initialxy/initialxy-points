import { defineEventHandler, H3Event, getQuery } from 'h3'
import { getDb } from '../../database'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const session = await requireUserSession(event)
  const user = session.user as User
  const { child_id } = getQuery(event)

  const numChildId = parseInt((child_id || '0') as string)

  if (user.role === 'child' && numChildId !== user.id) {
    throw createError({
      statusCode: 401,
      message: 'Child user can only query their own rewards',
    })
  }

  if (numChildId > 0) {
    // Parent can filter by specific child_id
    const rewards: Reward[] = await db.all(
      'SELECT * FROM rewards WHERE child_id = ?',
      numChildId
    )
    return { rewards } as RewardsResponse
  } else {
    // Parent can also query all rewards if no child_id is specified
    const rewards: Reward[] = await db.all('SELECT * FROM rewards')
    return { rewards } as RewardsResponse
  }
})
