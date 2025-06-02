import { defineEventHandler, H3Event } from 'h3'
import { initDb } from '../../database'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { validateString } from '../../utils/validation'

export default defineEventHandler(async (event: H3Event) => {
  const db = await initDb()
  const body = await readBody(event)

  const { username, passcode, role } = body

  const validatedUsername = validateString(username)
  const validatedPasscode = validateString(passcode)
  const validatedRole = validateString(role)

  if (!validatedUsername || !validatedPasscode || !validatedRole) {
    return {
      statusCode: 400,
      body: { message: 'Username, passcode, and role are required' },
    }
  }

  if (validatedRole !== 'parent' && validatedRole !== 'kid') {
    return {
      statusCode: 400,
      body: { message: 'Role must be either "parent" or "kid"' },
    }
  }

  const existingUser = await db.get(
    'SELECT * FROM users WHERE username = ?',
    validatedUsername
  )

  if (existingUser) {
    return {
      statusCode: 409,
      body: { message: 'Username already exists' },
    }
  }

  const hashedPasscode = await bcrypt.hash(validatedPasscode, 10)

  const result = await db.run(
    'INSERT INTO users (username, passcode, role) VALUES (?, ?, ?)',
    validatedUsername,
    hashedPasscode,
    validatedRole
  )

  // Generate JWT token
  const token = jwt.sign(
    { id: result.lastID, role: validatedRole },
    process.env.JWT_SECRET || 'your-secret-key',
    {
      expiresIn: '1h',
    }
  )

  return {
    statusCode: 201,
    body: {
      message: 'User registered successfully',
      token,
      userId: result.lastID,
    },
  }
})
