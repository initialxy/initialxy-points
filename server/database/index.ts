import { open, Database } from 'sqlite'
import sqlite3 from 'sqlite3'

let db: Database | null = null

async function getDb(dbPath = process.env.DB_PATH): Promise<Database> {
  if (dbPath == null) {
    throw new Error('DB_PATH environment variable is not set')
  }

  if (db) return db

  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  })

  return db
}

export { getDb }
