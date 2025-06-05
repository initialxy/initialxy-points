import { defineEventHandler, H3Event } from 'h3'
import { getDb } from '../../../database'
import { validateId } from '../../../utils/validation'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const user = event.context.user
  const taskId = validateId(event.context.params?.id)

  if (!taskId) {
    return {
      statusCode: 400,
      body: { message: 'Invalid task ID' },
    }
  }

  if (!user || user.role !== 'child') {
    return {
      statusCode: 403,
      body: { message: 'Forbidden' },
    }
  }

  // Check if the task exists and belongs to the user
  const task = await db.get(
    'SELECT * FROM tasks WHERE id = ? AND child_id = ?',
    [taskId, user.id]
  )

  if (!task) {
    return {
      statusCode: 404,
      body: { message: 'Task not found' },
    }
  }

  // Check if the task is already completed
  if (task.completed) {
    return {
      statusCode: 400,
      body: { message: 'Task already completed' },
    }
  }

  // Update the task as completed
  await db.run('UPDATE tasks SET completed = TRUE WHERE id = ?', taskId)

  // Update the user's points balance
  await db.run('UPDATE users SET points = points + ? WHERE id = ?', [
    task.points,
    user.id,
  ])

  return {
    statusCode: 200,
    body: { message: 'Task completed successfully', pointsEarned: task.points },
  }
})
