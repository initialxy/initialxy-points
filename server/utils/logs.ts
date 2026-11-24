import type { Database } from 'better-sqlite3'

const MAX_NUM_LOGS_RETENTION = 1000
const LOG_CHANGE_POINTS_DEBOUNCE_SECONDS = 30

type ExistingChangePointsLog = {
  id: number
  actor_id: number
  action_type: string
  recipient_id: number | null
  points_before: number | null
  points_after: number | null
}

export function logTaskAction(
  db: Database,
  actionType: string,
  actorId: number,
  task: Task,
  pointsBefore?: number,
  pointsAfter?: number
): void {
  const recurrenceType = getReadableRecurrenceType(task.recurrence_type)
  const log = {
    actor_id: actorId,
    action_type: actionType,
    recipient_id: task.child_id,
    points_before: pointsBefore ?? null,
    points_after: pointsAfter ?? null,
    additional_context: `${recurrenceType} task: ${task.description} • ${task.points} points`,
  }

  logAction(db, log)
}

export function logRewardAction(
  db: Database,
  actionType: string,
  actorId: number,
  reward: Reward,
  pointsBefore?: number,
  pointsAfter?: number
): void {
  const recurrenceType = getReadableRecurrenceType(reward.recurrence_type)
  const log = {
    actor_id: actorId,
    action_type: actionType,
    recipient_id: reward.child_id,
    points_before: pointsBefore ?? null,
    points_after: pointsAfter ?? null,
    additional_context: `${recurrenceType} reward: ${reward.description} • ${reward.points} points`,
  }

  logAction(db, log)
}

export function logAction(db: Database, log: Log): void {
  if (log.action_type === 'change_points') {
    // Check if we have a similar log line for change_points in the last 30
    // seconds
    const existingLog: ExistingChangePointsLog | undefined = db
      .prepare<
        [number, string, number | null, number],
        ExistingChangePointsLog
      >(
        `SELECT id, actor_id, action_type, recipient_id, points_before, points_after
         FROM logs
         WHERE actor_id = ?
         AND action_type = ?
         AND recipient_id = ?
         AND CAST(strftime('%s', CURRENT_TIMESTAMP) AS INTEGER) - CAST(strftime('%s', timestamp) AS INTEGER) <= ?
         LIMIT 1`
      )
      .get(
        log.actor_id,
        log.action_type,
        log.recipient_id ?? null,
        LOG_CHANGE_POINTS_DEBOUNCE_SECONDS
      )

    if (existingLog != null) {
      // If we just end up with the same points as before then perform a delete
      if (existingLog.points_before === log.points_after) {
        db.prepare<[number]>(`DELETE FROM logs WHERE id = ?`).run(
          existingLog.id
        )
      } else {
        db.prepare<[number | null, number]>(
          `UPDATE logs
             SET points_after = ?, timestamp = CURRENT_TIMESTAMP
             WHERE id = ?`
        ).run(log.points_after ?? null, existingLog.id)
      }
      return
    }
  }

  db.prepare<
    [number, string, number | null, number | null, number | null, string | null]
  >(
    `INSERT INTO logs (actor_id, action_type, recipient_id, points_before, points_after, additional_context)
       VALUES (?, ?, ?, ?, ?, ?)`
  ).run(
    log.actor_id,
    log.action_type,
    log.recipient_id ?? null,
    log.points_before ?? null,
    log.points_after ?? null,
    log.additional_context ?? null
  )

  // Delete old logs for retention
  db.prepare<[number]>(
    `DELETE FROM logs
      WHERE id NOT IN (
        SELECT id FROM (
          SELECT id FROM logs
          ORDER BY timestamp DESC
          LIMIT ?
        )
      )`
  ).run(MAX_NUM_LOGS_RETENTION)
}
