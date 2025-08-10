import { defineEventHandler, H3Event, getQuery } from 'h3'
import { getDb } from '../../database'

const DEFAULT_LIMIT = '50'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const session = await requireUserSession(event)
  const user = session.user as User
  const { limit } = getQuery(event)
  
  const numLimit = parseInt(limit as string || DEFAULT_LIMIT)
  const cond = user.role === 'parent'
    ? '1 = 1'  // Dummy condition
    : 'recipient_id = ?'
  
  const logs: Log[] = await db.all(
      `
      SELECT id, CAST(strftime('%s', timestamp) AS INTEGER) * 1000 AS timestamp, actor_id, action_type, recipient_id, points_before, points_after, additional_context
      FROM logs
      WHERE ${cond}
      ORDER BY timestamp DESC
      LIMIT ?
      `,
      user.role === 'parent'
        ? [numLimit]
        : [user.id, numLimit]
    );

  return { logs } as LogsResponse
})