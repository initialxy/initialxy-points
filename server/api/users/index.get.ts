import type { H3Event } from 'h3'
import { defineEventHandler, getQuery } from 'h3'
import { getDb } from '../../database'

export default defineEventHandler(async (event: H3Event) => {
  const db = getDb()
  const session = await requireUserSession(event)
  const user = session.user as User

  const { role } = getQuery(event)

  const roleFilter = (typeof role === 'string' ? role : 'child') || 'child'

  const fetchedUsers: User[] =
    roleFilter === 'all'
      ? db
          .prepare<[], User>('SELECT id, username, role, points FROM users')
          .all()
      : db
          .prepare<[string], User>(
            'SELECT id, username, role, points FROM users WHERE role = ?'
          )
          .all(roleFilter)

  // If child user, sanitize points.
  const users =
    user.role !== 'parent'
      ? fetchedUsers.map((u) => {
          u.points = 0
          return u
        })
      : fetchedUsers

  return { users } as UsersResponse
})
