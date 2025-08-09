import { defineEventHandler, H3Event } from 'h3'
import { getDb } from '../../../database'
import { logAction } from '../../../utils/logs'

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

  const pointsBefore = existingUser.points

  await db.run('UPDATE users SET points = ? WHERE id = ?', points, id)

  const log = {
    actor_id: user.id,
    action_type: 'change_points',
    recipient_id: existingUser.id,
    points_before: pointsBefore,
    points_after: points,
    additional_context: null,
  }

  await logAction(db, log)

  return { message: 'Points updated successfully' }
})
