import { defineEventHandler, H3Event, getQuery } from 'h3'
import { getDb } from '../../database'

const DEFAULT_LIMIT = '50'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const session = await requireUserSession(event)
  const user = session.user as User
  const { limit } = getQuery(event)

  const numLimit = parseInt((limit as string) || DEFAULT_LIMIT)
  const cond =
    user.role === 'parent'
      ? '1 = 1' // Dummy condition
      : 'recipient_id = ?'

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
    user.role === 'parent' ? [numLimit] : [user.id, numLimit]
  )

  return { logs } as LogsResponse
})
