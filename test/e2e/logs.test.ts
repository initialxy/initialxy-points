import { describe, it, expect, beforeEach } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import {
  createAuthTestData,
  createTestReward,
  createTestTask,
  getSessionCookie,
  getUserByUsername,
  resetDb,
  setTestUserPoints,
  TEST_CHILD_USER,
  TEST_PARENT_USER,
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
  })

  it('should correctly log task completions with added points', async () => {
    // Login as parent to get session cookie
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    const parentUser = await getUserByUsername(TEST_PARENT_USER.username)
    const childUser = await getUserByUsername(TEST_CHILD_USER.username)

    await setTestUserPoints(TEST_CHILD_USER.username, 100)

    const taskId = await createTestTask(
      parentUser.id,
      childUser.id,
      'Test Task',
      50,
      'single-use'
    )

    // Approve the task completion
    const response = await $fetch(`/api/tasks/${taskId}/approve_complete`, {
      method: 'POST',
      headers: {
        cookie: cookie,
      },
    })

    expect(response).toBeDefined()
    expect((response as any).statusCode).toBe(200)

    const logsResponse = await $fetch<LogsResponse>('/api/logs', {
      method: 'GET',
      headers: {
        cookie: cookie,
      },
    })

    expect(logsResponse).toBeDefined()
    expect(logsResponse.logs).toBeDefined()

    // Find the task completion log entry
    const completionLog = logsResponse.logs.find(
      (log) => log.action_type === 'approve_task_complete'
    )

    expect(completionLog).toBeDefined()
    expect(completionLog?.points_before).toBe(100)
    expect(completionLog?.points_after).toBe(150)
  })

  it('should correctly log reward redemptions with deducted points', async () => {
    // Login as parent to get session cookie
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    const parentUser = await getUserByUsername(TEST_PARENT_USER.username)
    const childUser = await getUserByUsername(TEST_CHILD_USER.username)

    await setTestUserPoints(TEST_CHILD_USER.username, 100)

    const rewardId = await createTestReward(
      parentUser.id,
      childUser.id,
      'Test Reward',
      50,
      'single-use'
    )

    // Approve the redemption
    const response = await $fetch(
      `/api/rewards/${rewardId}/approve_redemption`,
      {
        method: 'POST',
        headers: {
          cookie: cookie,
        },
      }
    )

    expect(response).toBeDefined()
    expect((response as any).statusCode).toBe(200)

    const logsResponse = await $fetch<LogsResponse>('/api/logs', {
      method: 'GET',
      headers: {
        cookie: cookie,
      },
    })

    expect(logsResponse).toBeDefined()
    expect(logsResponse.logs).toBeDefined()

    // Find the reward redemption log entry
    const redemptionLog = logsResponse.logs.find(
      (log) => log.action_type === 'approve_redemption'
    )

    expect(redemptionLog).toBeDefined()
    expect(redemptionLog?.points_before).toBe(100)
    expect(redemptionLog?.points_after).toBe(50)
  })
})
