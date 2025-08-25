import { getDb } from '../../server/database/index'
import { initializeDatabase } from '../../server/database'
import bcrypt from 'bcryptjs'

/**
 * Reset the database by dropping all tables and indices, then reinitializing the schema
 */
export async function resetDb() {
  const db = await getDb()

  // Get all table names
  const tables = await db.all(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'"
  )

  // Get all index names
  const indices = await db.all(
    "SELECT name FROM sqlite_master WHERE type = 'index' AND name NOT LIKE 'sqlite_%'"
  )

  // Drop all tables
  for (const table of tables) {
    await db.exec(`DROP TABLE IF EXISTS ${table.name}`)
  }

  // Drop all indices
  for (const index of indices) {
    await db.exec(`DROP INDEX IF EXISTS ${index.name}`)
  }

  // Reinitialize the database schema
  await initializeDatabase(db)
}

/**
 * Create basic test data for auth testing
 */
export async function createDbAuthTestData() {
  const db = await getDb()

  // Create a test user for authentication tests
  const hashedPassword = await bcrypt.hash('password', 10)
  await db.run(
    'INSERT OR REPLACE INTO users (username, password, role) VALUES (?, ?, ?)',
    ['testuser', hashedPassword, 'child']
  )

  // Create a parent user as well for more comprehensive testing
  const parentHashedPassword = await bcrypt.hash('parentpassword', 10)
  await db.run(
    'INSERT OR REPLACE INTO users (username, password, role) VALUES (?, ?, ?)',
    ['parentuser', parentHashedPassword, 'parent']
  )
}
