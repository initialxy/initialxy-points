import { defineEventHandler, H3Event, readBody } from 'h3'
import { getDb } from '../../database'
import { User, Task, TaskResponse } from '~/types'

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

  const body = await readBody(event)
  const { description, points, task_type } = body

  if (description == null || points == null || task_type == null) {
    return {
      statusCode: 400,
      body: { message: 'Missing required fields' },
    }
  }

  if (task_type !== 'throw-away' && task_type !== 'perpetual') {
    return {
      statusCode: 400,
      body: { message: 'Invalid task type' },
    }
  }

  // Get the current task to preserve child_id, parent_id, and is_marked_complete
  const taskResult = await db.get(
    'SELECT child_id, is_marked_complete FROM tasks WHERE id = ? AND parent_id = ?',
    [taskId, user.id]
  )

  if (taskResult == null) {
    return {
      statusCode: 404,
      body: { message: 'Task not found or not authorized' },
    }
  }

  const result = await db.run(
    'UPDATE tasks SET description = ?, points = ?, task_type = ? WHERE id = ? AND parent_id = ?',
    [description, points, task_type, taskId, user.id]
  )

  if (result.changes === 0) {
    return {
      statusCode: 404,
      body: { message: 'Task not found or not authorized' },
    }
  }

  return {
    task: {
      id: taskId,
      description,
      points,
      task_type,
      child_id: taskResult.child_id,
      parent_id: user.id,
      is_marked_complete: taskResult.is_marked_complete,
    },
  } as TaskResponse
})
