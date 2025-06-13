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
    !tableNames.includes('rewards')
  ) {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        passcode TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('parent', 'child')),
        points INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        points INTEGER NOT NULL,
        parent_id INTEGER,
        child_id INTEGER,
        task_type TEXT NOT NULL CHECK(task_type IN ('throw-away', 'perpetual')),
        is_marked_complete BOOLEAN DEFAULT FALSE,
        FOREIGN KEY(child_id) REFERENCES users(id),
        FOREIGN KEY(parent_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS rewards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        points INTEGER NOT NULL,
        parent_id INTEGER,
        FOREIGN KEY(parent_id) REFERENCES users(id)
      );
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
  passcode: string,
  role: string = 'child'
) {
  // Hash the passcode before saving
  const hashedPasscode = await bcrypt.hash(passcode, 10)
  await db.run(
    'INSERT INTO users (username, passcode, role) VALUES (?, ?, ?)',
    [username, hashedPasscode, role]
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

async function setPasscode(db: Database, username: string, passcode: string) {
  // Hash the passcode before saving
  const hashedPasscode = await bcrypt.hash(passcode, 10)
  await db.run('UPDATE users SET passcode = ? WHERE username = ?', [
    hashedPasscode,
    username,
  ])
  console.log(`User ${username}'s passcode updated`)
}

async function showHelp() {
  console.log(`
Admin Console Commands:
  help - Show this help message
  init-db - Initialize database
  list - Show all users and their roles
  add-user <username> <passcode> [role] - Add a new user
  delete-user <username> - Delete a user
  rename-user <oldUsername> <newUsername> - Rename a user
  change-user-role <username> <role> - Change a user's role
  set-passcode <username> <passcode> - Set a new passcode for a user
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
            console.log('Usage: add-user <username> <passcode> [role]')
          } else {
            const [username, passcode, role] = args
            await addUser(db, username, passcode, role || 'child')
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
        case 'set-passcode':
          if (args.length < 2) {
            console.log('Usage: set-passcode <username> <passcode>')
          } else {
            const [username, passcode] = args
            await setPasscode(db, username, passcode)
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
