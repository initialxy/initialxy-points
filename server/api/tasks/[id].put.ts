import { defineEventHandler, H3Event, readBody, createError } from 'h3'
import { getDb } from '../../database'

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

  if (user.role !== 'parent') {
    throw createError({
      statusCode: 403,
      message: 'Forbidden',
    })
  }

  const body = await readBody(event)
  const { description, points, recurrence_type } = body

  if (description == null || points == null || recurrence_type == null) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields',
    })
  }

  if (recurrence_type !== 'single-use' && recurrence_type !== 'perpetual') {
    throw createError({
      statusCode: 400,
      message: 'Invalid task type',
    })
  }

  // Check if task exists
  const taskResult = await db.get<Task>('SELECT * FROM tasks WHERE id = ?', [
    taskId,
  ])

  if (taskResult == null) {
    throw createError({
      statusCode: 404,
      message: 'Task not found or not authorized',
    })
  }

  const result = await db.run(
    'UPDATE tasks SET description = ?, points = ?, recurrence_type = ? WHERE id = ?',
    [description, points, recurrence_type, taskId]
  )

  if (result.changes === 0) {
    throw createError({
      statusCode: 404,
      message: 'Task not found or not authorized',
    })
  }

  await logTaskAction(db, 'update_task', user.id, taskResult)

  const updatedTask = await db.get<Task>('SELECT * FROM tasks WHERE id = ?', [
    taskId,
  ])

  return {
    task: updatedTask,
  } as TaskResponse
})
