import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import { promises as fs } from 'fs';

let db: any = null;

async function initDb() {
  if (db) return db;

  const dbPath = path.resolve(__dirname, 'database.sqlite');
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  // Check if tables exist, if not initialize them
  const tables = await db.all(
    'SELECT name FROM sqlite_master WHERE type="table"'
  );
  const tableNames = tables.map((t: any) => t.name);

  if (
    !tableNames.includes('users') ||
    !tableNames.includes('tasks') ||
    !tableNames.includes('rewards') ||
    !tableNames.includes('wishlist')
  ) {
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
    `);
  }

  return db;
}

export { initDb };
