import { Database } from 'sqlite'
import { Task } from '../../shared/types'

const MAX_NUM_LOGS_RETENTION = 1000
const LOG_CHANGE_POINTS_DEBOUNCE_SECONDS = 30

export async function logTaskAction(
  db: Database,
  actionType: string,
  actorId: number,
  task: Task,
  pointsBefore?: number,
  pointsAfter?: number
): Promise<void> {
  const log = {
    actor_id: actorId,
    action_type: actionType,
    recipient_id: task.child_id,
    points_before: pointsBefore ?? null,
    points_after: pointsAfter ?? null,
    additional_context: `${task.task_type} task: ${task.description} - ${task.points} points`,
  }

  await logAction(db, log)
}

export async function logAction(db: Database, log: Log): Promise<void> {
  if (log.action_type === 'change_points') {
    // Check if we have a similar log line for change_points in the last 30
    // seconds
    const existingLog: Log | undefined = await db.get(
      `SELECT id, actor_id, action_type, recipient_id, points_before, points_after
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
      // If we just end up with the same points as before then perform a delete
      if (existingLog.points_before === log.points_after) {
        await db.run(`DELETE FROM logs WHERE id = ?`, existingLog.id)
      } else {
        await db.run(
          `UPDATE logs
           SET points_after = ?, timestamp = CURRENT_TIMESTAMP
           WHERE id = ?`,
          log.points_after,
          existingLog.id
        )
      }
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

  // Delete old logs for retention
  await db.run(
    `DELETE FROM logs
    WHERE id NOT IN (
      SELECT id FROM (
        SELECT id FROM logs
        ORDER BY timestamp DESC
        LIMIT ?
      )
    )`,
    MAX_NUM_LOGS_RETENTION
  )
}
