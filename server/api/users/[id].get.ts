import { defineEventHandler } from 'h3'
import { getDb } from '../../database'

type ChildSummary = Pick<User, 'id' | 'username' | 'points'>

export default defineEventHandler(async (event) => {
  const db = getDb()
  const session = await requireUserSession(event)
  const user = session.user as User
  const userId = validateId(parseInt(event.context.params?.id ?? '0') as number)

  if (userId == null || (user.id !== userId && user.role !== 'parent')) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden',
    })
  }

  const fetchedUser: ChildSummary | undefined = db
    .prepare<[number, string], ChildSummary>(
      'SELECT id, username, points FROM users WHERE id = ? AND role = ?'
    )
    .get(userId, 'child')

  if (fetchedUser == null) {
    throw createError({
      statusCode: 404,
      message: 'User not found',
    })
  }

  return { user: fetchedUser } as UserResponse
})
