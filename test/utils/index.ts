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
export function resetDb(): void {
  const db = getDb()

  // Drop all indices. Careful not to delete SQLite's internal tables
  const indices = db
    .prepare<[], { name: string }>(
      "SELECT name FROM sqlite_master WHERE type = 'index' AND name NOT LIKE 'sqlite_%'"
    )
    .all()

  for (const index of indices) {
    db.exec(`DROP INDEX IF EXISTS ${index.name}`)
  }

  // Drop tables child-first so the foreign key constraints (which
  // better-sqlite3 enforces) are satisfied
  const dropOrder = ['logs', 'rewards', 'tasks', 'users']
  for (const table of dropOrder) {
    db.exec(`DROP TABLE IF EXISTS ${table}`)
  }

  initializeDatabase(db)
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
export function getAllUsers(): User[] {
  const db = getDb()
  return db
    .prepare<[], User>('SELECT id, username, role, points FROM users')
    .all()
}

/**
 * Get a user by their username
 */
export function getUserByUsername(username: string): User {
  const db = getDb()
  const user = db
    .prepare<[string], User>(
      'SELECT id, username, role, points FROM users WHERE username = ?'
    )
    .get(username)
  if (user == null) {
    throw new Error(`User ${username} not found`)
  }
  return user
}

/**
 * Create a new test user
 */
export async function createTestUser(
  username: string,
  password: string,
  role: 'parent' | 'child'
): Promise<void> {
  const db = getDb()
  const hashedPassword = await bcrypt.hash(password, 10)
  db.prepare<[string, string, 'parent' | 'child']>(
    'INSERT OR REPLACE INTO users (username, password, role) VALUES (?, ?, ?)'
  ).run(username, hashedPassword, role)
}

/**
 * Set points for a test user
 */
export function setTestUserPoints(username: string, points: number): void {
  const db = getDb()
  db.prepare<[number, string]>(
    'UPDATE users SET points = ? WHERE username = ?'
  ).run(points, username)
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
): number {
  const db = getDb()
  const result = db
    .prepare<[string, number, number, number, 'single-use' | 'perpetual']>(
      'INSERT INTO tasks (description, points, parent_id, child_id, recurrence_type) VALUES (?, ?, ?, ?, ?)'
    )
    .run(description, points, parentId, childId, recurrenceType)
  return Number(result.lastInsertRowid)
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
): number {
  const db = getDb()
  const result = db
    .prepare<[string, number, number, number, 'single-use' | 'perpetual']>(
      'INSERT INTO rewards (description, points, parent_id, child_id, recurrence_type) VALUES (?, ?, ?, ?, ?)'
    )
    .run(description, points, parentId, childId, recurrenceType)
  return Number(result.lastInsertRowid)
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
 * Safely extract the HTTP status code from a thrown $fetch/ofetch error
 */
export function getFetchErrorStatus(error: unknown): number | undefined {
  return (error as { status?: number } | null | undefined)?.status
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
