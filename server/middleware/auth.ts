import { defineEventHandler, H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  return
  if (['/login', '/'].includes(event.path)) {
    return
  }

  const session = await requireUserSession(event)

  if (session.user == null) {
    event.node.res.statusCode = 401
    event.node.res.end(JSON.stringify({ message: 'Unauthorized' }))
    return
  }
})
