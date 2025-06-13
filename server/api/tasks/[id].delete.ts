import { defineEventHandler, H3Event } from 'h3'
import { getDb } from '../../database'
import { User } from '~/types'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const session = await requireUserSession(event)
  const user = session.user as User

  // Get task ID from URL parameters
  const taskId = validateId(parseInt(event.context.params?.id ?? '0') as number)
  if (taskId == null) {
    return {
      statusCode: 400,
      body: { message: 'Invalid task ID' },
    }
  }

  if (user.role !== 'parent') {
    return {
      statusCode: 403,
      body: { message: 'Forbidden' },
    }
  }

  const result = await db.run(
    'DELETE FROM tasks WHERE id = ? AND parent_id = ?',
    [taskId, user.id]
  )

  if (result.changes === 0) {
    return {
      statusCode: 404,
      body: { message: 'Task not found or not authorized' },
    }
  }

  return {
    statusCode: 204,
    body: null,
  }
})
