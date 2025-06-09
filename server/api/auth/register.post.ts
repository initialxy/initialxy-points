import { defineEventHandler, H3Event } from 'h3'
import { getDb } from '../../database'
import bcrypt from 'bcryptjs'
import { CreatedIdResponseBody } from '~/types'
import { validateString } from '../../utils/validation'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
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

  if (validatedRole !== 'parent' && validatedRole !== 'child') {
    return {
      statusCode: 400,
      body: { message: 'Role must be either "parent" or "child"' },
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

  const result = await db.get(
    'INSERT INTO users (username, passcode, role) VALUES (?, ?, ?) RETURNING id',
    validatedUsername,
    hashedPasscode,
    validatedRole
  )

  const postResponseBody: CreatedIdResponseBody = {
    message: 'User created successfully',
    createdId: result.id,
  }

  return {
    statusCode: 201,
    body: postResponseBody,
  }
})
