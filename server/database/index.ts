import { open, Database } from 'sqlite'
import sqlite3 from 'sqlite3'

let db: Database | null = null

export async function getDb(dbPath = process.env.DB_PATH): Promise<Database> {
  if (dbPath == null) {
    throw new Error('DB_PATH environment variable is not set')
  }

  if (db != null) {
    return db
  }

  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  })

  return db
}

export async function initializeDatabase(db: Database): Promise<Database> {
  // Check if tables exist, if not initialize them
  const tables = await db.all(
    'SELECT name FROM sqlite_master WHERE type="table"'
  )
  const tableNames = tables.map((t: any) => t.name)

  if (
    !tableNames.includes('users') ||
    !tableNames.includes('tasks') ||
    !tableNames.includes('logs') ||
    !tableNames.includes('rewards')
  ) {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('parent', 'child')),
        points INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        points INTEGER NOT NULL,
        parent_id INTEGER,
        child_id INTEGER,
        recurrence_type TEXT NOT NULL CHECK(recurrence_type IN ('single-use', 'perpetual')),
        is_marked_complete BOOLEAN DEFAULT FALSE,
        FOREIGN KEY(child_id) REFERENCES users(id),
        FOREIGN KEY(parent_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS rewards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        points INTEGER NOT NULL,
        parent_id INTEGER,
        child_id INTEGER,
        recurrence_type TEXT NOT NULL CHECK(recurrence_type IN ('single-use', 'perpetual')),
        is_redemption_requested BOOLEAN DEFAULT FALSE,
        FOREIGN KEY(parent_id) REFERENCES users(id),
        FOREIGN KEY(child_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        actor_id INTEGER NOT NULL,
        action_type TEXT NOT NULL,
        recipient_id INTEGER,
        points_before INTEGER,
        points_after INTEGER,
        additional_context TEXT,
        FOREIGN KEY(actor_id) REFERENCES users(id),
        FOREIGN KEY(recipient_id) REFERENCES users(id)
      );

      CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs(timestamp);
      CREATE INDEX IF NOT EXISTS idx_logs_recipient_id ON logs(recipient_id);
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
      CREATE INDEX IF NOT EXISTS idx_tasks_child_id ON tasks(child_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_parent_id ON tasks(parent_id);
      CREATE INDEX IF NOT EXISTS idx_rewards_parent_id ON rewards(parent_id);
      CREATE INDEX IF NOT EXISTS idx_rewards_child_id ON rewards(child_id);
    `)
  }

  return db
}
