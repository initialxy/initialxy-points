import { defineEventHandler, H3Event } from 'h3'
import { getDb } from '../../database'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const session = await requireUserSession(event)
  const user = session.user as User

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

  // Get the task to log before deletion
  const taskResult = await db.get<Task>('SELECT * FROM tasks WHERE id = ?', [
    taskId,
  ])

  if (taskResult == null) {
    return {
      statusCode: 404,
      body: { message: 'Task not found or not authorized' },
    }
  }

  const result = await db.run('DELETE FROM tasks WHERE id = ?', [taskId])

  if (result.changes === 0) {
    return {
      statusCode: 404,
      body: { message: 'Task not found or not authorized' },
    }
  }

  await logTaskAction(db, 'delete_task', user.id, taskResult)

  return {
    statusCode: 204,
    body: null,
  }
})
