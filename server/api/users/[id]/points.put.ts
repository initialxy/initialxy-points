import { defineEventHandler, H3Event, createError } from 'h3'
import { getDb } from '../../../database'
import { logAction } from '../../../utils/logs'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const session = await requireUserSession(event)
  const user = session.user as User

  // Only parents can update points
  if (user.role !== 'parent') {
    throw createError({
      statusCode: 403,
      message: 'Forbidden',
    })
  }

  const { id } = getRouterParams(event)
  const { points_change } = await readBody(event)

  if (typeof points_change !== 'number') {
    throw createError({
      statusCode: 400,
      message: 'Invalid points change value',
    })
  }

  // Check if the user exists and is a child
  const existingUser: User | undefined = await db.get(
    'SELECT id, username, role, points FROM users WHERE id = ?',
    id
  )

  if (!existingUser || existingUser.role !== 'child') {
    throw createError({
      statusCode: 404,
      message: 'User not found or not a child',
    })
  }

  const pointsBefore = existingUser.points
  let newPoints = pointsBefore + points_change
  if (newPoints < 0) {
    newPoints = 0
  }

  await db.run('UPDATE users SET points = ? WHERE id = ?', newPoints, id)

  const log = {
    actor_id: user.id,
    action_type: 'change_points',
    recipient_id: existingUser.id,
    points_before: pointsBefore,
    points_after: newPoints,
    additional_context: null,
  }

  await logAction(db, log)

  return { message: 'Points updated successfully' }
})
