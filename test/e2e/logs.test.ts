import { describe, it, expect, beforeEach } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import {
  resetDb,
  createAuthTestData,
  getSessionCookie,
  getUserByUsername,
  TEST_PARENT_USER,
  TEST_CHILD_USER,
} from '../utils/index'
import { LogsResponse } from '../../shared/types'

describe('Logs API', async () => {
  await setup({
    build: true,
    server: true,
    browser: false,
  })

  beforeEach(async () => {
    await resetDb()
    await createAuthTestData()
  })

  it('should get logs with parent session', async () => {
    // Login as parent to get session cookie
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    const response = await $fetch<LogsResponse>('/api/logs', {
      method: 'GET',
      headers: {
        cookie: cookie,
      },
    })

    expect(response).toBeDefined()
    expect(response.logs).toBeDefined()
  })

  it('should get logs with child session (filtered by own logs)', async () => {
    // Login as child to get session cookie
    const cookie = await getSessionCookie(
      TEST_CHILD_USER.username,
      TEST_CHILD_USER.password
    )

    // Get the child user by username
    const childUser = await getUserByUsername(TEST_CHILD_USER.username)

    const response = await $fetch<LogsResponse>('/api/logs', {
      method: 'GET',
      headers: {
        cookie: cookie,
      },
      query: {
        recipient_id: childUser.id,
      },
    })

    expect(response).toBeDefined()
    expect(response.logs).toBeDefined()
  })

  it('should get logs for specific recipient with parent session', async () => {
    // Login as parent to get session cookie
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    // Get the child user by username
    const childUser = await getUserByUsername(TEST_CHILD_USER.username)

    const response = await $fetch<LogsResponse>('/api/logs', {
      method: 'GET',
      headers: {
        cookie: cookie,
      },
      query: {
        recipient_id: childUser.id,
      },
    })

    expect(response).toBeDefined()
    expect(response.logs).toBeDefined()
  })

  it('should get logs with custom limit', async () => {
    // Login as parent to get session cookie
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    const response = await $fetch<LogsResponse>('/api/logs', {
      method: 'GET',
      headers: {
        cookie: cookie,
      },
      query: {
        limit: 10,
      },
    })

    expect(response).toBeDefined()
    expect(response.logs).toBeDefined()
  })

  it('should reject access to logs with unauthorized child session', async () => {
    // Login as child to get session cookie
    const cookie = await getSessionCookie(
      TEST_CHILD_USER.username,
      TEST_CHILD_USER.password
    )

    try {
      await $fetch('/api/logs', {
        method: 'GET',
        headers: {
          cookie: cookie,
        },
        query: {
          recipient_id: 999999999,
        },
      })
    } catch (error: any) {
      // Should fail with 401 since child user can't query other users' logs
      expect(error).toBeDefined()
      expect(error.status).toBe(401)
      return
    }
    expect.fail('Should have thrown an error')
  })

  it('should handle empty logs gracefully', async () => {
    // Login as parent to get session cookie
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    const response = await $fetch<LogsResponse>('/api/logs', {
      method: 'GET',
      headers: {
        cookie: cookie,
      },
    })

    expect(response).toBeDefined()
    expect(response.logs).toBeDefined()
    // Logs might be empty, but the structure should be correct
  })
})
