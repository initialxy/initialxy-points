import { defineEventHandler, getQuery } from 'h3'
import { getDb } from '../../database'

export default defineEventHandler(async (event) => {
  const db = await getDb()
  const kidId = getQuery(event).id

  if (!kidId) {
    return {
      statusCode: 400,
      body: { message: 'Kid ID is required' },
    }
  }

  const kid = await db.get(
    'SELECT id AS kid_id, username, points FROM users WHERE id = ? AND role = ?',
    [kidId, 'child']
  )

  if (!kid) {
    return {
      statusCode: 404,
      body: { message: 'Kid not found' },
    }
  }

  return { kid }
})
