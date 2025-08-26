import { defineEventHandler, H3Event, readBody, createError } from 'h3'
import { getDb } from '../../database'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const session = await requireUserSession(event)
  const user = session.user as User

  if (user.role !== 'parent') {
    throw createError({
      statusCode: 403,
      message: 'Forbidden',
    })
  }

  const body = await readBody(event)
  const { description, points, child_id, recurrence_type } = body

  if (!description || !points || !child_id || !recurrence_type) {
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

  const result = await db.run(
    'INSERT INTO tasks (description, points, child_id, recurrence_type, parent_id) VALUES (?, ?, ?, ?, ?)',
    [description, points, child_id, recurrence_type, user.id]
  )

  const taskId = result.lastID as number

  const task = {
    id: taskId,
    description,
    points,
    child_id,
    recurrence_type,
    parent_id: user.id,
    is_marked_complete: false,
  }

  await logTaskAction(db, 'create_task', user.id, task)

  return {
    task,
  } as TaskResponse
})
