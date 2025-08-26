import { defineEventHandler, getQuery } from 'h3'
import { getDb } from '../../database'

export default defineEventHandler(async (event) => {
  const db = await getDb()
  const session = await requireUserSession(event)
  const user = session.user as User
  const userId = validateId(parseInt(event.context.params?.id ?? '0') as number)

  if (userId == null || (user.id !== userId && user.role !== 'parent')) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden',
    })
  }

  const fetchedUser = await db.get(
    'SELECT id, username, points FROM users WHERE id = ? AND role = ?',
    [userId, 'child']
  )

  if (fetchedUser == null) {
    throw createError({
      statusCode: 404,
      message: 'User not found',
    })
  }

  return { user: fetchedUser } as UserResponse
})
