import { defineEventHandler, H3Event } from 'h3'
import { getDb } from '../../database'
import { Reward, User } from '~/types'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const session = await getUserSession(event)
  const user = (session?.user || null) as User | null

  if (!user || user.role !== 'parent') {
    return {
      statusCode: 403,
      body: { message: 'Forbidden' },
    }
  }

  const rewards: Reward[] = await db.all(
    'SELECT * FROM rewards WHERE parent_id = ?',
    user.id
  )
  return { rewards }
})
