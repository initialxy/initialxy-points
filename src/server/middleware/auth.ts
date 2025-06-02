import jwt from 'jsonwebtoken'
import type { JwtPayload } from 'jsonwebtoken'
import { defineEventHandler, H3Event } from 'h3'
import { initDb } from '../database'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export default defineEventHandler(async (event: H3Event) => {
  const db = await initDb()
  const token = event.req.headers.authorization

  if (!token) {
    event.node.res.statusCode = 401
    event.node.res.end(JSON.stringify({ message: 'Unauthorized' }))
    return
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token.split(' ')[1], JWT_SECRET) as JwtPayload
    const user = await db.get('SELECT * FROM users WHERE id = ?', decoded.id)

    if (!user) {
      event.node.res.statusCode = 401
      event.node.res.end(JSON.stringify({ message: 'Unauthorized' }))
      return
    }

    event.context.user = user
  } catch (error) {
    event.node.res.statusCode = 401
    event.node.res.end(JSON.stringify({ message: 'Invalid token' }))
    return
  }
})
