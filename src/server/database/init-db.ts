import { open } from 'sqlite'
import sqlite3 from 'sqlite3'
import { promises as fs } from 'fs'
import path from 'path'

async function initDb() {
  const dbPath = path.resolve(__dirname, 'database.sqlite')
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  })

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      passcode TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('parent', 'kid')),
      points INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      points INTEGER NOT NULL,
      kid_id INTEGER,
      completed BOOLEAN DEFAULT FALSE,
      FOREIGN KEY(kid_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS rewards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      points INTEGER NOT NULL,
      parent_id INTEGER,
      FOREIGN KEY(parent_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS wishlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reward_id INTEGER,
      kid_id INTEGER,
      approved BOOLEAN DEFAULT FALSE,
      FOREIGN KEY(reward_id) REFERENCES rewards(id),
      FOREIGN KEY(kid_id) REFERENCES users(id)
    );
  `)

  console.log('Database initialized successfully')
}

initDb().catch(console.error)
