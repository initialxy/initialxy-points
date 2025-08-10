import { Database } from 'sqlite'

const LOG_CHANGE_POINTS_DEBOUNCE_SECONDS = 30

export async function logAction(db: Database, log: Log): Promise<void> {
  if (log.action_type === 'change_points') {
    // Check if we have a similar log line for change_points in the last 30
    // seconds
    const existingLog: JustId | undefined = await db.get(
      `SELECT id
       FROM logs 
       WHERE actor_id = ? 
       AND action_type = ? 
       AND recipient_id = ?
       AND CAST(strftime('%s', CURRENT_TIMESTAMP) AS INTEGER) - CAST(strftime('%s', timestamp) AS INTEGER) <= ?
       LIMIT 1`,
      log.actor_id,
      log.action_type,
      log.recipient_id ?? null,
      LOG_CHANGE_POINTS_DEBOUNCE_SECONDS
    )

    if (existingLog) {
      await db.run(
        `UPDATE logs 
         SET points_after = ?, timestamp = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        log.points_after,
        existingLog.id
      )
      return
    }
  }

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
