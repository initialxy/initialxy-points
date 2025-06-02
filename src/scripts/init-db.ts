import { initDb } from '../server/database/index.ts'

initDb().catch(console.error)
