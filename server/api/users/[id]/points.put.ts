import type { H3Event } from 'h3'
import { defineEventHandler, createError } from 'h3'
import { getDb } from '../../../database'
import { logAction } from '../../../utils/logs'

type ChildSummary = Pick<User, 'id' | 'username' | 'role' | 'points'>

export default defineEventHandler(async (event: H3Event) => {
  const db = getDb()
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
  const userId = validateId(parseInt(id ?? '0'))
  if (userId == null) {
    throw createError({
      statusCode: 400,
      message: 'Invalid user ID',
    })
  }

  const { points_change } = await readBody(event)

  if (typeof points_change !== 'number') {
    throw createError({
      statusCode: 400,
      message: 'Invalid points change value',
    })
  }

  // Check if the user exists and is a child
  const existingUser: ChildSummary | undefined = db
    .prepare<[number], ChildSummary>(
      'SELECT id, username, role, points FROM users WHERE id = ?'
    )
    .get(userId)

  if (existingUser == null || existingUser.role !== 'child') {
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

  const applyPointsChange = db.transaction(
    (recipientId: number, pointsAfter: number) => {
      db.prepare<[number, number]>(
        'UPDATE users SET points = ? WHERE id = ?'
      ).run(pointsAfter, recipientId)

      logAction(db, {
        actor_id: user.id,
        action_type: 'change_points',
        recipient_id: recipientId,
        points_before: pointsBefore,
        points_after: pointsAfter,
        additional_context: null,
      })
    }
  )

  applyPointsChange(existingUser.id, newPoints)

  return { message: 'Points updated successfully' }
})
