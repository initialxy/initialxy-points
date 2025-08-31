import { fetch } from '@nuxt/test-utils/e2e'
import { getDb } from '../../server/database/index'
import { initializeDatabase } from '../../server/database'
import bcrypt from 'bcryptjs'
import type { User } from '../../shared/types'
import type { Page } from '@playwright/test'

export const TEST_PARENT_USER = {
  username: 'parentuser',
  password: 'parentpassword',
  role: 'parent' as const,
}

export const TEST_CHILD_USER = {
  username: 'childuser',
  password: 'childpassword',
  role: 'child' as const,
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
export async function createAuthTestData() {
  await createTestUser(
    TEST_PARENT_USER.username,
    TEST_PARENT_USER.password,
    TEST_PARENT_USER.role
  )
  await createTestUser(
    TEST_CHILD_USER.username,
    TEST_CHILD_USER.password,
    TEST_CHILD_USER.role
  )
}

/**
 * Get all users from the current database state
 */
export async function getAllUsers(): Promise<User[]> {
  const db = await getDb()
  return await db.all('SELECT id, username, role, points FROM users')
}

/**
 * Create a new test user
 */
export async function createTestUser(
  username: string,
  password: string,
  role: 'parent' | 'child'
) {
  const db = await getDb()
  const hashedPassword = await bcrypt.hash(password, 10)
  await db.run(
    'INSERT OR REPLACE INTO users (username, password, role) VALUES (?, ?, ?)',
    [username, hashedPassword, role]
  )
}

/**
 * Set points for a test user
 */
export async function setTestUserPoints(username: string, points: number) {
  const db = await getDb()
  await db.run('UPDATE users SET points = ? WHERE username = ?', [
    points,
    username,
  ])
}

/**
 * Create a test task for a child user
 */
export async function createTestTask(
  parentId: number,
  childId: number,
  description: string,
  points: number,
  recurrenceType: 'single-use' | 'perpetual' = 'single-use'
) {
  const db = await getDb()
  const result = await db.run(
    'INSERT INTO tasks (description, points, parent_id, child_id, recurrence_type) VALUES (?, ?, ?, ?, ?)',
    [description, points, parentId, childId, recurrenceType]
  )
  return result.lastID
}

/**
 * Create a test reward for a child user
 */
export async function createTestReward(
  parentId: number,
  childId: number,
  description: string,
  points: number,
  recurrenceType: 'single-use' | 'perpetual' = 'single-use'
) {
  const db = await getDb()
  const result = await db.run(
    'INSERT INTO rewards (description, points, parent_id, child_id, recurrence_type) VALUES (?, ?, ?, ?, ?)',
    [description, points, parentId, childId, recurrenceType]
  )
  return result.lastID
}

/**
 * Perform a login then return the session cookie, which can be used in
 * subsequent requests to keep the same session.
 */
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

/**
 * Perform a login using Playwright
 */
export async function playwrightLogin(
  page: Page,
  username: string,
  password: string
) {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByTestId('login_button').click()
  await page.waitForURL('**/dashboard')
}
