import { defineEventHandler, H3Event } from 'h3'
import { getDb } from '../../database'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const user = event.context.user

  if (!user || user.role !== 'parent') {
    return {
      statusCode: 403,
      body: { message: 'Forbidden' },
    }
  }

  const rewards = await db.all(
    'SELECT * FROM rewards WHERE parent_id = ?',
    user.id
  )
  return { rewards }
})
