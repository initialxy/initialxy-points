import { defineEventHandler, H3Event } from 'h3'
import { getDb } from '../../database'
import { Task, TasksResponse, User } from '~/types'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const session = await requireUserSession(event)
  const user = session.user as User

  if (user.role === 'child') {
    // For child users, only return their tasks
    const tasks: Task[] = await db.all(
      'SELECT * FROM tasks WHERE child_id = ?',
      user.id
    )
    return { tasks } as TasksResponse
  } else if (user.role === 'parent') {
    // For parent users, return all tasks for their children
    const tasks: Task[] = await db.all(
      'SELECT * FROM tasks WHERE parent_id = ?',
      user.id
    )
    return { tasks } as TasksResponse
  } else {
    return {
      statusCode: 403,
      body: { message: 'Forbidden' },
    }
  }
})
