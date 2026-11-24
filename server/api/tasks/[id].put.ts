import type { H3Event } from 'h3'
import { defineEventHandler, readBody, createError } from 'h3'
import { getDb } from '../../database'

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
  const taskResult: Task | undefined = db
    .prepare<[number], Task>('SELECT * FROM tasks WHERE id = ?')
    .get(taskId)

  if (taskResult == null) {
    throw createError({
      statusCode: 404,
      message: 'Task not found or not authorized',
    })
  }

  const updateTaskAndLog = db.transaction((task: Task) => {
    const result = db
      .prepare<[string, number, string, number]>(
        'UPDATE tasks SET description = ?, points = ?, recurrence_type = ? WHERE id = ?'
      )
      .run(description, points, recurrence_type, task.id)

    if (result.changes === 0) {
      throw createError({
        statusCode: 404,
        message: 'Task not found or not authorized',
      })
    }

    const updatedTask: Task | undefined = db
      .prepare<[number], Task>('SELECT * FROM tasks WHERE id = ?')
      .get(task.id)

    if (updatedTask == null) {
      throw createError({
        statusCode: 404,
        message: 'Task not found or not authorized',
      })
    }

    logTaskAction(db, 'update_task', user.id, updatedTask)

    return updatedTask
  })

  const updatedTask = updateTaskAndLog(taskResult)

  return {
    task: updatedTask,
  } as TaskResponse
})
