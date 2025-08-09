import { Database } from 'sqlite'

export async function logAction(
  db: Database,
  log: Log
): Promise<void> {
  await db.run(
    `INSERT INTO logs (actor_id, action_type, recipient_id, points_before, points_after, additional_context)
     VALUES (?, ?, ?, ?, ?, ?)`,
    log.actor_id,
    log.action_type,
    log.recipient_id ?? null,
    log.points_before ?? null,
    log.points_after ?? null,
    log.additional_context ?? null
  )
}