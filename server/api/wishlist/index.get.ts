import { defineEventHandler, H3Event } from 'h3'
import { getDb } from '../../database'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const user = event.context.user

  if (!user || user.role !== 'child') {
    return {
      statusCode: 403,
      body: { message: 'Forbidden' },
    }
  }

  const wishlist = await db.all(
    `
    SELECT wishlist.*, rewards.title AS reward_title, rewards.description AS reward_description, rewards.points AS reward_points
    FROM wishlist
    JOIN rewards ON wishlist.reward_id = rewards.id
    WHERE wishlist.child_id = ?
  `,
    user.id
  )

  return { wishlist }
})
