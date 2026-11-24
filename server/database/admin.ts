import type { Database } from 'better-sqlite3'
import readline from 'readline'
import { getDb, initializeDatabase } from './index'
import bcrypt from 'bcryptjs'

function listUsers(db: Database): void {
  const users = db
    .prepare<unknown[], { id: number; username: string; role: string }>(
      'SELECT id, username, role FROM users'
    )
    .all()
  console.log('Users:')
  users.forEach((user) => {
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
  db.prepare(
    'INSERT INTO users (username, password, role) VALUES (?, ?, ?)'
  ).run(username, hashedPassword, role)
  console.log(`User ${username} added with role ${role}`)
}

function deleteUser(db: Database, username: string): void {
  db.prepare('DELETE FROM users WHERE username = ?').run(username)
  console.log(`User ${username} deleted`)
}

function renameUser(
  db: Database,
  oldUsername: string,
  newUsername: string
): void {
  db.prepare('UPDATE users SET username = ? WHERE username = ?').run(
    newUsername,
    oldUsername
  )
  console.log(`User ${oldUsername} renamed to ${newUsername}`)
}

function changeUserRole(db: Database, username: string, role: string): void {
  db.prepare('UPDATE users SET role = ? WHERE username = ?').run(role, username)
  console.log(`User ${username}'s role changed to ${role}`)
}

async function setPassword(db: Database, username: string, password: string) {
  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10)
  db.prepare('UPDATE users SET password = ? WHERE username = ?').run(
    hashedPassword,
    username
  )
  console.log(`User ${username}'s password updated`)
}

function showLogs(db: Database, count: number): void {
  const logs = db
    .prepare<
      unknown[],
      {
        id: number
        timestamp: string
        actor: string | null
        action_type: string
        recipient: string | null
        points_before: number | null
        points_after: number | null
      }
    >(
      `
    SELECT l.id, l.timestamp, u.username as actor, l.action_type,
           r.username as recipient, l.points_before, l.points_after
    FROM logs l
    LEFT JOIN users u ON l.actor_id = u.id
    LEFT JOIN users r ON l.recipient_id = r.id
    ORDER BY l.timestamp DESC
    LIMIT ?
  `
    )
    .all(count)

  console.log(`\nTop ${count} log entries:`)
  console.log(
    'ID | Timestamp | Actor | Action Type | Recipient | Points Before | Points After'
  )
  console.log(
    '---|-----------|-------|-------------|-----------|---------------|-------------'
  )
  logs.forEach((log) => {
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

  if (process.env.DB_PATH == null) {
    console.log('Enter database file path to get started')
  } else {
    db = getDb(process.env.DB_PATH)
    showHelp()
  }
  rl.setPrompt('admin> ')
  rl.prompt()

  rl.on('line', async (input) => {
    try {
      if (db == null) {
        db = getDb(input.trim())
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
          initializeDatabase(db)
          console.log('Database initialized')
          break
        case 'list':
          listUsers(db)
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
            deleteUser(db, username)
          }
          break
        case 'rename-user':
          if (args.length < 2) {
            console.log('Usage: rename-user <oldUsername> <newUsername>')
          } else {
            const [oldUsername, newUsername] = args
            renameUser(db, oldUsername, newUsername)
          }
          break
        case 'change-user-role':
          if (args.length < 2) {
            console.log('Usage: change-user-role <username> <role>')
          } else {
            const [username, role] = args
            changeUserRole(db, username, role)
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
              showLogs(db, count)
            }
          }
          break
        case 'exit':
          rl.close()
          process.exit(0)
          break
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
