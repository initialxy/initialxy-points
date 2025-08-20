import { Database } from 'sqlite'
import readline from 'readline'
import { getDb } from './index'
import bcrypt from 'bcryptjs'

async function initializeDatabase(db: Database): Promise<Database> {
  // Check if tables exist, if not initialize them
  const tables = await db.all(
    'SELECT name FROM sqlite_master WHERE type="table"'
  )
  const tableNames = tables.map((t: any) => t.name)

  if (
    !tableNames.includes('users') ||
    !tableNames.includes('tasks') ||
    !tableNames.includes('logs')
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
    `)
  }

  return db
}

async function listUsers(db: Database) {
  const users = await db.all('SELECT id, username, role FROM users')
  console.log('Users:')
  users.forEach((user: any) => {
    console.log(`- ${user.id}: ${user.username} (${user.role})`)
  })
}

async function addUser(
  db: Database,
  username: string,
  password: string,
  role: string = 'child'
) {
  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10)
  await db.run(
    'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
    [username, hashedPassword, role]
  )
  console.log(`User ${username} added with role ${role}`)
}

async function deleteUser(db: Database, username: string) {
  await db.run('DELETE FROM users WHERE username = ?', [username])
  console.log(`User ${username} deleted`)
}

async function renameUser(
  db: Database,
  oldUsername: string,
  newUsername: string
) {
  await db.run('UPDATE users SET username = ? WHERE username = ?', [
    newUsername,
    oldUsername,
  ])
  console.log(`User ${oldUsername} renamed to ${newUsername}`)
}

async function changeUserRole(db: Database, username: string, role: string) {
  await db.run('UPDATE users SET role = ? WHERE username = ?', [role, username])
  console.log(`User ${username}'s role changed to ${role}`)
}

async function setPassword(db: Database, username: string, password: string) {
  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10)
  await db.run('UPDATE users SET password = ? WHERE username = ?', [
    hashedPassword,
    username,
  ])
  console.log(`User ${username}'s password updated`)
}

async function showLogs(db: Database, count: number) {
  const logs = await db.all(
    `
    SELECT l.id, l.timestamp, u.username as actor, l.action_type,
           r.username as recipient, l.points_before, l.points_after
    FROM logs l
    LEFT JOIN users u ON l.actor_id = u.id
    LEFT JOIN users r ON l.recipient_id = r.id
    ORDER BY l.timestamp DESC
    LIMIT ?
  `,
    [count]
  )

  console.log(`\nTop ${count} log entries:`)
  console.log(
    'ID | Timestamp | Actor | Action Type | Recipient | Points Before | Points After'
  )
  console.log(
    '---|-----------|-------|-------------|-----------|---------------|-------------'
  )
  logs.forEach((log: any) => {
    console.log(
      `${log.id} | ${log.timestamp} | ${log.actor} | ${log.action_type} | ${log.recipient || '-'} | ${log.points_before || '-'} | ${log.points_after || '-'}`
    )
  })
  console.log('')
}

async function showHelp() {
  console.log(`
Admin Console Commands:
  help - Show this help message
  init-db - Initialize database
  list - Show all users and their roles
  add-user <username> <password> [role] - Add a new user
  delete-user <username> - Delete a user
  rename-user <oldUsername> <newUsername> - Rename a user
  change-user-role <username> <role> - Change a user's role
  set-password <username> <password> - Set a new password for a user
  show-logs <n> - Show top n log entries
  exit - Exit the admin console
`)
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  let db: Database | null = null

  console.log('Welcome to the Admin Console')
  console.log('Enter database file path to get started')

  rl.setPrompt('admin> ')
  rl.prompt()

  rl.on('line', async (input) => {
    try {
      if (db == null) {
        db = await getDb(input.trim())
        showHelp()
        rl.prompt()

        return
      }

      const [command, ...args] = input.trim().split(' ')

      switch (command) {
        case 'help':
          showHelp()
          break
        case 'init-db':
          const initDb = await initializeDatabase(db)
          console.log('Database initialized')
          break
        case 'list':
          await listUsers(db)
          break
        case 'add-user':
          if (args.length < 2) {
            console.log('Usage: add-user <username> <password> [role]')
          } else {
            const [username, password, role] = args
            await addUser(db, username, password, role || 'child')
          }
          break
        case 'delete-user':
          if (args.length < 1) {
            console.log('Usage: delete-user <username>')
          } else {
            const [username] = args
            await deleteUser(db, username)
          }
          break
        case 'rename-user':
          if (args.length < 2) {
            console.log('Usage: rename-user <oldUsername> <newUsername>')
          } else {
            const [oldUsername, newUsername] = args
            await renameUser(db, oldUsername, newUsername)
          }
          break
        case 'change-user-role':
          if (args.length < 2) {
            console.log('Usage: change-user-role <username> <role>')
          } else {
            const [username, role] = args
            await changeUserRole(db, username, role)
          }
          break
        case 'set-password':
          if (args.length < 2) {
            console.log('Usage: set-password <username> <password>')
          } else {
            const [username, password] = args
            await setPassword(db, username, password)
          }
          break
        case 'show-logs':
          if (args.length < 1) {
            console.log('Usage: show-logs <n>')
          } else {
            const count = parseInt(args[0])
            if (isNaN(count) || count <= 0) {
              console.log('Please provide a valid positive number')
            } else {
              await showLogs(db, count)
            }
          }
          break
        case 'exit':
          rl.close()
          process.exit(0)
        default:
          console.log(`Unknown command: ${command}`)
          showHelp()
      }
      rl.prompt()
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`)
      rl.prompt()
    }
  })
}

main().catch(console.error)
