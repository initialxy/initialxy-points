import { defineEventHandler, H3Event, createError } from 'h3'
import { getDb } from '../../../database'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const session = await requireUserSession(event)
  const user = session.user as User
  const taskId = validateId(parseInt(event.context.params?.id ?? '0') as number)

  if (taskId == null) {
    throw createError({
      statusCode: 400,
      message: 'Invalid task ID',
    })
  }

  // Check if the task exists
  const task = await db.get<Task>('SELECT * FROM tasks WHERE id = ?', [taskId])

  if (task == null) {
    throw createError({
      statusCode: 404,
      message: 'Task not found or not authorized',
    })
  }

  // Only allowed if user is parent or child acting on their assigned task
  if (user.role !== 'parent' && user.id !== task.child_id) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden',
    })
  }

  if (!task.is_marked_complete) {
    throw createError({
      statusCode: 400,
      message: 'Task is not marked as completed yet',
    })
  }

  await db.run(
    'UPDATE tasks SET is_marked_complete = FALSE WHERE id = ?',
    taskId
  )

  await logTaskAction(db, 'reject_task_complete', user.id, task)

  return {
    statusCode: 200,
    body: { message: 'Task completion rejected' },
  }
})
