import { defineEventHandler, H3Event } from 'h3'
import { getDb } from '../../database'
import { User, UsersResponse } from '~/types'

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

  const children: User[] = await db.all(
    'SELECT * FROM users WHERE parent_id = ?',
    user.id
  )

  return { users: children } as UsersResponse
})
