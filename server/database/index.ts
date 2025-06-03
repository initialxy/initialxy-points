import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { open, Database } from 'sqlite'
import path from 'path'
import sqlite3 from 'sqlite3'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let db: Database | null = null

async function getDb(): Promise<Database> {
  if (db) return db

  const dbPath = path.resolve(__dirname, 'database.sqlite')
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  })

  return db
}

export { getDb }
