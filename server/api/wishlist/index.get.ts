import { defineEventHandler, H3Event, getQuery } from 'h3'
import { getDb } from '../../database'
import { WishlistItem, WishlistResponse, User } from '~/types'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const session = await requireUserSession(event)
  const user = session.user as User

  const { id } = getQuery(event)

  if (id == null && user.role !== 'child') {
    return {
      statusCode: 403,
      body: { message: 'Forbidden' },
    }
  }

  const userId = id ?? user.id

  const wishlist: WishlistItem[] = await db.all(
    'SELECT * FROM wishlist WHERE child_id = ?',
    userId
  )
  return { wishlist } as WishlistResponse
})
