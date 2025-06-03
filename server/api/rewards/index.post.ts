import { defineEventHandler, H3Event } from 'h3'
import { getDb } from '../../database'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const user = event.context.user
  const body = await readBody(event)

  if (!user || user.role !== 'parent') {
    return {
      statusCode: 403,
      body: { message: 'Forbidden' },
    }
  }

  const { title, description, points } = body

  if (!title || !points) {
    return {
      statusCode: 400,
      body: { message: 'Title and points are required' },
    }
  }

  const result = await db.run(
    'INSERT INTO rewards (title, description, points, parent_id) VALUES (?, ?, ?, ?)',
    title,
    description,
    points,
    user.id
  )

  return {
    statusCode: 201,
    body: { message: 'Reward created successfully', rewardId: result.lastID },
  }
})
