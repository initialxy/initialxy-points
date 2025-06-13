import { defineEventHandler, H3Event } from 'h3'
import { getDb } from '../../../database'
import { validateId } from '../../../utils/validation'
import { User, Task } from '~/types'

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

  // Handle task completion based on task type
  if (task.task_type === 'throw-away') {
    // For throw-away tasks, delete the task after completion
    await db.run('DELETE FROM tasks WHERE id = ?', taskId)
  } else {
    // For perpetual tasks, reset the is_marked_complete flag
    await db.run(
      'UPDATE tasks SET is_marked_complete = FALSE WHERE id = ?',
      taskId
    )
  }

  // Update the child's points balance
  await db.run('UPDATE users SET points = points + ? WHERE id = ?', [
    task.points,
    task.child_id,
  ])

  return {
    statusCode: 200,
    body: { message: 'Task completion approved', pointsEarned: task.points },
  }
})
