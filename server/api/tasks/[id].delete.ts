import type { H3Event } from 'h3'
import { defineEventHandler, createError } from 'h3'
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

  // Get the task to log before deletion
  const taskResult: Task | undefined = db
    .prepare<[number], Task>('SELECT * FROM tasks WHERE id = ?')
    .get(taskId)

  if (taskResult == null) {
    throw createError({
      statusCode: 404,
      message: 'Task not found or not authorized',
    })
  }

  const deleteTaskAndLog = db.transaction((task: Task) => {
    const result = db
      .prepare<[number]>('DELETE FROM tasks WHERE id = ?')
      .run(task.id)

    if (result.changes === 0) {
      throw createError({
        statusCode: 404,
        message: 'Task not found or not authorized',
      })
    }

    logTaskAction(db, 'delete_task', user.id, task)
  })

  deleteTaskAndLog(taskResult)

  return {
    statusCode: 204,
    body: null,
  }
})
