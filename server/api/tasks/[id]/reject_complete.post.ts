import { defineEventHandler, H3Event } from 'h3'
import { getDb } from '../../../database'
import { validateId } from '../../../utils/validation'
import { User, Task } from '~/types'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const session = await requireUserSession(event)
  const user = session.user as User
  const taskId = validateId(event.context.params?.id)

  if (taskId == null) {
    return {
      statusCode: 400,
      body: { message: 'Invalid task ID' },
    }
  }

  // Check if the task exists and belongs to the user
  const task = await db.get<Task>(
    'SELECT * FROM tasks WHERE id = ? AND parent_id = ?',
    [taskId, user.id]
  )

  if (!task) {
    return {
      statusCode: 404,
      body: { message: 'Task not found or not authorized' },
    }
  }

  if (!task.is_marked_complete) {
    return {
      statusCode: 400,
      body: { message: 'Task is not marked as completed yet' },
    }
  }

  // Reset the is_marked_complete flag
  await db.run('UPDATE tasks SET is_marked_complete = FALSE WHERE id = ?', taskId)

  return {
    statusCode: 200,
    body: { message: 'Task completion rejected' },
  }
})