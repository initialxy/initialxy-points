import type { H3Event } from 'h3'
import { defineEventHandler, getQuery } from 'h3'
import { getDb } from '../../database'

export default defineEventHandler(async (event: H3Event) => {
  const db = getDb()
  const session = await requireUserSession(event)
  const user = session.user as User
  const { child_id } = getQuery(event)

  const numChildId = parseInt((child_id || '0') as string)

  if (user.role === 'child' && numChildId !== user.id) {
    throw createError({
      statusCode: 401,
      message: 'Child user can only query their own tasks',
    })
  }

  if (numChildId > 0) {
    // Parent can filter by specific child_id
    const tasks: Task[] = db
      .prepare<[number], Task>('SELECT * FROM tasks WHERE child_id = ?')
      .all(numChildId)
    return { tasks } as TasksResponse
  } else {
    // Parent can also query all tasks if no child_id is specified
    const tasks: Task[] = db.prepare<[], Task>('SELECT * FROM tasks').all()
    return { tasks } as TasksResponse
  }
})
