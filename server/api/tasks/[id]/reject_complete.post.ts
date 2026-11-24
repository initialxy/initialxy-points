import type { H3Event } from 'h3'
import { defineEventHandler, createError } from 'h3'
import { getDb } from '../../../database'

export default defineEventHandler(async (event: H3Event) => {
  const db = getDb()
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
  const task: Task | undefined = db
    .prepare<[number], Task>('SELECT * FROM tasks WHERE id = ?')
    .get(taskId)

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

  const rejectCompletionAndLog = db.transaction((t: Task) => {
    db.prepare<[number]>(
      'UPDATE tasks SET is_marked_complete = FALSE WHERE id = ?'
    ).run(t.id)

    logTaskAction(db, 'reject_task_complete', user.id, t)
  })

  rejectCompletionAndLog(task)

  return {
    statusCode: 200,
    body: { message: 'Task completion rejected' },
  }
})
