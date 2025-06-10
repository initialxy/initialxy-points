import { defineEventHandler, H3Event, getQuery } from 'h3'
import { getDb } from '../../database'
import { WishlistItem, WishlistResponse, User } from '~/types'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const session = await requireUserSession(event)
  const user = session.user as User

  const { child_id } = getQuery(event)

  if (child_id) {
    const wishlist: WishlistItem[] = await db.all(
      'SELECT * FROM wishlist WHERE child_id = ?',
      child_id
    )
    const response: WishlistResponse = { wishlist }
    return response
  } else {
    if (user.role !== 'child') {
      return {
        statusCode: 403,
        body: { message: 'Forbidden' },
      }
    }

    const wishlist: WishlistItem[] = await db.all(
      'SELECT * FROM wishlist WHERE child_id = ?',
      user.id
    )
    const response: WishlistResponse = { wishlist }
    return response
  }
})
