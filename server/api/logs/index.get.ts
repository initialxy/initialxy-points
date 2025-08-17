import { defineEventHandler, H3Event, getQuery } from 'h3'
import { getDb } from '../../database'

const DEFAULT_LIMIT = '50'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const session = await requireUserSession(event)
  const user = session.user as User
  const { limit, recipient_id } = getQuery(event)

  const numLimit = parseInt((limit as string) || DEFAULT_LIMIT)
  const numRecipientId = parseInt((recipient_id || '0') as string)

  if (user.role === 'child' && numRecipientId !== user.id) {
    throw createError({
      statusCode: 401,
      message: 'Child user can only query their own logs',
    })
  }

  const cond = numRecipientId > 0 ? 'recipient_id = ?' : '? >= 0' // dummy condition

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
    [numRecipientId, numLimit]
  )

  return { logs } as LogsResponse
})
