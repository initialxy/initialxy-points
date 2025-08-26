import { fetch } from '@nuxt/test-utils/e2e'
import { getDb } from '../../server/database/index'
import { initializeDatabase } from '../../server/database'
import bcrypt from 'bcryptjs'
import type { User } from '../../shared/types'

export const TEST_PARENT_USER = {
  username: 'parentuser',
  password: 'parentpassword',
  role: 'parent',
}

export const TEST_CHILD_USER = {
  username: 'childuser',
  password: 'childpassword',
  role: 'child',
}

/**
 * Reset the database by dropping all tables and indices, then reinitializing the schema
 */
export async function resetDb() {
  const db = await getDb()

  // Get all tables and indices. Careful not to delete SQLite's internal tables
  const tables = await db.all(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'"
  )

  const indices = await db.all(
    "SELECT name FROM sqlite_master WHERE type = 'index' AND name NOT LIKE 'sqlite_%'"
  )

  // Drop all tables and indices
  for (const table of tables) {
    await db.exec(`DROP TABLE IF EXISTS ${table.name}`)
  }

  for (const index of indices) {
    await db.exec(`DROP INDEX IF EXISTS ${index.name}`)
  }

  await initializeDatabase(db)
}

/**
 * Create basic test data for auth testing
 */
export async function createDbAuthTestData() {
  const db = await getDb()

  const parentHashedPassword = await bcrypt.hash(TEST_PARENT_USER.password, 10)
  await db.run(
    'INSERT OR REPLACE INTO users (username, password, role) VALUES (?, ?, ?)',
    [TEST_PARENT_USER.username, parentHashedPassword, TEST_PARENT_USER.role]
  )

  const hashedPassword = await bcrypt.hash(TEST_CHILD_USER.password, 10)
  await db.run(
    'INSERT OR REPLACE INTO users (username, password, role) VALUES (?, ?, ?)',
    [TEST_CHILD_USER.username, hashedPassword, TEST_CHILD_USER.role]
  )
}

/**
 * Get all users from the current database state
 */
export async function getAllUsers(): Promise<User[]> {
  const db = await getDb()
  return await db.all('SELECT id, username, role, points FROM users')
}

export async function getSessionCookie(username: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })

  return response.headers.getSetCookie()?.join('; ')
}
