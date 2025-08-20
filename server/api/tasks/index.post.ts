import { defineEventHandler, H3Event, readBody } from 'h3'
import { getDb } from '../../database'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const session = await requireUserSession(event)
  const user = session.user as User

  if (user.role !== 'parent') {
    return {
      statusCode: 403,
      body: { message: 'Forbidden' },
    }
  }

  const body = await readBody(event)
  const { description, points, child_id, task_type } = body

  if (!description || !points || !child_id || !task_type) {
    return {
      statusCode: 400,
      body: { message: 'Missing required fields' },
    }
  }

  if (task_type !== 'single-use' && task_type !== 'perpetual') {
    return {
      statusCode: 400,
      body: { message: 'Invalid task type' },
    }
  }

  const result = await db.run(
    'INSERT INTO tasks (description, points, child_id, task_type, parent_id) VALUES (?, ?, ?, ?, ?)',
    [description, points, child_id, task_type, user.id]
  )

  const taskId = result.lastID as number

  const task = {
    id: taskId,
    description,
    points,
    child_id,
    task_type,
    parent_id: user.id,
    is_marked_complete: false,
  }

  await logTaskAction(db, 'create_task', user.id, task)

  return {
    task,
  } as TaskResponse
})
