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

  // Verify user is a parent
  if (user.role !== 'parent') {
    throw createError({
      statusCode: 403,
      message: 'Forbidden',
    })
  }

  // Check if the task exists (any parent can approve completions)
  const task = await db.get<Task>('SELECT * FROM tasks WHERE id = ?', [taskId])

  if (!task) {
    throw createError({
      statusCode: 404,
      message: 'Task not found or not authorized',
    })
  }

  if (task.recurrence_type === 'single-use') {
    // For single-use tasks, delete the task after completion
    await db.run('DELETE FROM tasks WHERE id = ?', taskId)
  } else {
    // For perpetual tasks, reset the is_marked_complete flag
    await db.run(
      'UPDATE tasks SET is_marked_complete = FALSE WHERE id = ?',
      taskId
    )
  }

  // Get the child's current points before updating
  const child = await db.get<User>('SELECT points FROM users WHERE id = ?', [
    task.child_id,
  ])

  if (!child) {
    throw createError({
      statusCode: 404,
      message: 'Child user not found',
    })
  }

  await db.run('UPDATE users SET points = points + ? WHERE id = ?', [
    task.points,
    task.child_id,
  ])

  await logTaskAction(
    db,
    'approve_task_complete',
    user.id,
    task,
    child.points,
    child.points + task.points
  )

  return {
    statusCode: 200,
    body: { message: 'Task completion approved', pointsEarned: task.points },
  }
})
