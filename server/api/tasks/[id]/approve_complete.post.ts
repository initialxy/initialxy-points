import type { H3Event } from 'h3'
import { defineEventHandler, createError } from 'h3'
import { getDb } from '../../../database'

type ChildPoints = Pick<User, 'points'>

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

  // Verify user is a parent
  if (user.role !== 'parent') {
    throw createError({
      statusCode: 403,
      message: 'Forbidden',
    })
  }

  // Check if the task exists (any parent can approve completions)
  const task: Task | undefined = db
    .prepare<[number], Task>('SELECT * FROM tasks WHERE id = ?')
    .get(taskId)

  if (task == null) {
    throw createError({
      statusCode: 404,
      message: 'Task not found or not authorized',
    })
  }

  const approveCompletion = db.transaction((t: Task) => {
    if (t.recurrence_type === 'single-use') {
      // For single-use tasks, delete the task after completion
      db.prepare<[number]>('DELETE FROM tasks WHERE id = ?').run(t.id)
    } else {
      // For perpetual tasks, reset the is_marked_complete flag
      db.prepare<[number]>(
        'UPDATE tasks SET is_marked_complete = FALSE WHERE id = ?'
      ).run(t.id)
    }

    // Get the child's current points before updating
    const child: ChildPoints | undefined = db
      .prepare<[number], ChildPoints>('SELECT points FROM users WHERE id = ?')
      .get(t.child_id)

    if (child == null) {
      throw createError({
        statusCode: 404,
        message: 'Child user not found',
      })
    }

    db.prepare<[number, number]>(
      'UPDATE users SET points = points + ? WHERE id = ?'
    ).run(t.points, t.child_id)

    logTaskAction(
      db,
      'approve_task_complete',
      user.id,
      t,
      child.points,
      child.points + t.points
    )
  })

  approveCompletion(task)

  return {
    statusCode: 200,
    body: { message: 'Task completion approved', pointsEarned: task.points },
  }
})
