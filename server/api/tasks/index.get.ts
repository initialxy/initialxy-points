import { defineEventHandler, H3Event } from 'h3'
import { getDb } from '../../database'
import { validateId } from '../../utils/validation'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const user = event.context.user

  if (!user || user.role !== 'child') {
    return {
      statusCode: 403,
      body: { message: 'Forbidden' },
    }
  }

  const userId = validateId(user.id)

  if (!userId) {
    return {
      statusCode: 400,
      body: { message: 'Invalid user ID' },
    }
  }

  const tasks = await db.all('SELECT * FROM tasks WHERE child_id = ?', userId)
  return { tasks }
})
