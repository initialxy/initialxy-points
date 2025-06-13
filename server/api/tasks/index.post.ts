import { defineEventHandler, H3Event, readBody } from 'h3'
import { getDb } from '../../database'
import { User, TaskResponse } from '~/types'

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
  const { description, points, kid_id, task_type } = body

  if (!description || !points || !kid_id || !task_type) {
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

  const result = await db.run(
    'INSERT INTO tasks (description, points, child_id, task_type, parent_id) VALUES (?, ?, ?, ?, ?)',
    [description, points, kid_id, task_type, user.id]
  )

  const taskId = result.lastID as number

  return {
    task: {
      id: taskId,
      description,
      points,
      task_type,
      child_id: kid_id,
      parent_id: user.id,
    },
  } as TaskResponse
})
