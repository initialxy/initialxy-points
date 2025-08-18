import { defineEventHandler, H3Event, getQuery } from 'h3'
import { getDb } from '../../database'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
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
    const tasks: Task[] = await db.all(
      'SELECT * FROM tasks WHERE child_id = ?',
      numChildId
    )
    return { tasks } as TasksResponse
  } else {
    // Parent can also query all tasks if no child_id is specified
    const tasks: Task[] = await db.all('SELECT * FROM tasks')
    return { tasks } as TasksResponse
  }
})
