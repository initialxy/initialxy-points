import { defineEventHandler, H3Event } from 'h3'
import { getDb } from '../../../database'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const session = await requireUserSession(event)
  const user = session.user as User

  // Only parents can update points
  if (user.role !== 'parent') {
    return {
      statusCode: 403,
      body: { message: 'Forbidden' },
    }
  }

  const { id } = getRouterParams(event)
  const { points } = await readBody(event)

  if (typeof points !== 'number' || points < 0) {
    return {
      statusCode: 400,
      body: { message: 'Invalid points value' },
    }
  }

  // Check if the user exists and is a child
  const existingUser: User | undefined = await db.get(
    'SELECT id, username, role, points FROM users WHERE id = ?',
    id
  )

  if (!existingUser || existingUser.role !== 'child') {
    return {
      statusCode: 404,
      body: { message: 'User not found or not a child' },
    }
  }

  // Update points
  await db.run(
    'UPDATE users SET points = ? WHERE id = ?',
    points,
    id
  )

  return { message: 'Points updated successfully' }
})