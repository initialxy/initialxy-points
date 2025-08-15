import { defineEventHandler, H3Event, getQuery } from 'h3'
import { getDb } from '../../database'

const DEFAULT_LIMIT = '50'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const session = await requireUserSession(event)
  const user = session.user as User
  const { limit, recipient_id } = getQuery(event)

  const numLimit = parseInt((limit as string) || DEFAULT_LIMIT)

  // Check if we should filter by recipient_id
  let cond = ''
  let params: any[] = []

  if (recipient_id && (user.role === 'parent' || user.id === recipient_id)) {
    // Parent can see logs for any child, child can only see their own logs
    cond = 'recipient_id = ?'
    params = [recipient_id, numLimit]
  } else if (user.role === 'parent') {
    // Parent sees all logs
    cond = '1 = 1'
    params = [numLimit]
  } else {
    // Child user only sees their own logs
    cond = 'recipient_id = ?'
    params = [user.id, numLimit]
  }

  const logs: Log[] = await db.all(
    `
      SELECT
        logs.id AS id,
        CAST(strftime('%s', timestamp) AS INTEGER) * 1000 AS timestamp,
        actor_id,
        actors.username AS actor_username,
        action_type,
        recipient_id,
        recipients.username AS recipient_username,
        points_before,
        points_after,
        additional_context
      FROM logs
      LEFT JOIN users AS actors ON logs.actor_id = actors.id
      LEFT JOIN users AS recipients ON logs.recipient_id = recipients.id
      WHERE ${cond}
      ORDER BY timestamp DESC
      LIMIT ?
      `,
    params
  )

  return { logs } as LogsResponse
})
