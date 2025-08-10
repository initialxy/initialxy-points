import { defineEventHandler, H3Event, getQuery } from 'h3'
import { getDb } from '../../database'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const session = await requireUserSession(event)
  const user = session.user as User

  const { role } = getQuery(event)

  const cond = role === 'all' ? '1=1' : 'role = ?'

  const fetchedUsers: User[] = await db.all(
    `SELECT id, username, role, points FROM users WHERE ${cond}`,
    role === 'all' ? [] : [role || 'child']
  )

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
