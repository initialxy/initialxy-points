import { describe, it, expect, beforeEach } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import {
  resetDb,
  createDbAuthTestData,
  getSessionCookie,
  getAllUsers,
  TEST_PARENT_USER,
  TEST_CHILD_USER,
} from '../utils/index'
import { RewardResponse, RewardsResponse } from '../../shared/types'

describe('Rewards API', async () => {
  await setup({
    build: true,
    server: true,
    browser: false,
  })

  beforeEach(async () => {
    await resetDb()
    await createDbAuthTestData()
  })

  it('should get all rewards with parent session', async () => {
    // Login as parent to get session cookie
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    const response = await $fetch<RewardsResponse>('/api/rewards', {
      method: 'GET',
      headers: {
        cookie: cookie,
      },
    })

    expect(response).toBeDefined()
    expect(response.rewards).toBeDefined()
  })

  it('should get all rewards with child session (filtered by own rewards)', async () => {
    // Login as child to get session cookie
    const cookie = await getSessionCookie(
      TEST_CHILD_USER.username,
      TEST_CHILD_USER.password
    )

    // Get all users and find the child user
    const allUsers = await getAllUsers()
    const childUser = allUsers.find(
      (user) => user.username === TEST_CHILD_USER.username
    )

    if (!childUser) {
      throw new Error('Child user not found in database')
    }

    const response = await $fetch<RewardsResponse>('/api/rewards', {
      method: 'GET',
      headers: {
        cookie: cookie,
      },
      query: {
        child_id: childUser.id,
      },
    })

    expect(response).toBeDefined()
    expect(response.rewards).toBeDefined()
  })

  it('should get rewards for specific child with parent session', async () => {
    // Login as parent to get session cookie
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    // Get all users and find the child user
    const allUsers = await getAllUsers()
    const childUser = allUsers.find(
      (user) => user.username === TEST_CHILD_USER.username
    )

    if (!childUser) {
      throw new Error('Child user not found in database')
    }

    const response = await $fetch<RewardsResponse>('/api/rewards', {
      method: 'GET',
      headers: {
        cookie: cookie,
      },
      query: {
        child_id: childUser.id,
      },
    })

    expect(response).toBeDefined()
    expect(response.rewards).toBeDefined()
  })

  it('should create reward with parent session', async () => {
    // Login as parent to get session cookie
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    // Get all users and find the child user
    const allUsers = await getAllUsers()
    const childUser = allUsers.find(
      (user) => user.username === TEST_CHILD_USER.username
    )

    if (!childUser) {
      throw new Error('Child user not found in database')
    }

    const response = await $fetch<RewardResponse>('/api/rewards', {
      method: 'POST',
      body: {
        description: 'Test reward',
        points: 10,
        child_id: childUser.id,
        recurrence_type: 'single-use',
      },
      headers: {
        cookie: cookie,
      },
    })

    expect(response).toBeDefined()
    expect(response.reward).toBeDefined()
    expect(response.reward.description).toBe('Test reward')
    expect(response.reward.points).toBe(10)
    expect(response.reward.child_id).toBe(childUser.id)
  })

  it('should reject reward creation without parent session', async () => {
    // Login as child to get session cookie
    const cookie = await getSessionCookie(
      TEST_CHILD_USER.username,
      TEST_CHILD_USER.password
    )

    try {
      await $fetch('/api/rewards', {
        method: 'POST',
        body: {
          description: 'Test reward',
          points: 10,
          child_id: 1,
          recurrence_type: 'single-use',
        },
        headers: {
          cookie: cookie,
        },
      })
    } catch (error: any) {
      // Should fail with 403 since child user can't create rewards
      expect(error).toBeDefined()
      expect(error.status).toBe(403)
      return
    }
    expect.fail('Should have thrown an error')
  })

  it('should reject reward creation with missing fields', async () => {
    // Login as parent to get session cookie
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    try {
      await $fetch('/api/rewards', {
        method: 'POST',
        body: {
          description: 'Test reward',
          points: 10,
          // Missing child_id and recurrence_type
        },
        headers: {
          cookie: cookie,
        },
      })
    } catch (error: any) {
      // Should fail with 400 due to missing fields
      expect(error).toBeDefined()
      expect(error.status).toBe(400)
      return
    }
    expect.fail('Should have thrown an error')
  })

  it('should update reward with parent session', async () => {
    // Login as parent to get session cookie
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    // First create a reward to update
    const allUsers = await getAllUsers()
    const childUser = allUsers.find(
      (user) => user.username === TEST_CHILD_USER.username
    )

    if (!childUser) {
      throw new Error('Child user not found in database')
    }

    const createResponse = await $fetch<RewardResponse>('/api/rewards', {
      method: 'POST',
      body: {
        description: 'Original reward',
        points: 10,
        child_id: childUser.id,
        recurrence_type: 'single-use',
      },
      headers: {
        cookie: cookie,
      },
    })

    const rewardId = createResponse.reward.id

    const response = await $fetch<RewardResponse>(`/api/rewards/${rewardId}`, {
      method: 'PUT',
      body: {
        description: 'Updated reward',
        points: 20,
        recurrence_type: 'perpetual',
      },
      headers: {
        cookie: cookie,
      },
    })

    expect(response).toBeDefined()
    expect(response.reward).toBeDefined()
    expect(response.reward.description).toBe('Updated reward')
    expect(response.reward.points).toBe(20)
  })

  it('should reject reward update without parent session', async () => {
    // Login as child to get session cookie
    const cookie = await getSessionCookie(
      TEST_CHILD_USER.username,
      TEST_CHILD_USER.password
    )

    try {
      await $fetch('/api/rewards/1', {
        method: 'PUT',
        body: {
          description: 'Updated reward',
          points: 20,
          recurrence_type: 'perpetual',
        },
        headers: {
          cookie: cookie,
        },
      })
    } catch (error: any) {
      // Should fail with 403 since child user can't update rewards
      expect(error).toBeDefined()
      expect(error.status).toBe(403)
      return
    }
    expect.fail('Should have thrown an error')
  })

  it('should delete reward with parent session', async () => {
    // Login as parent to get session cookie
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    // First create a reward to delete
    const allUsers = await getAllUsers()
    const childUser = allUsers.find(
      (user) => user.username === TEST_CHILD_USER.username
    )

    if (!childUser) {
      throw new Error('Child user not found in database')
    }

    const createResponse = await $fetch<RewardResponse>('/api/rewards', {
      method: 'POST',
      body: {
        description: 'Reward to delete',
        points: 10,
        child_id: childUser.id,
        recurrence_type: 'single-use',
      },
      headers: {
        cookie: cookie,
      },
    })

    const rewardId = createResponse.reward.id

    const response = await $fetch<{ statusCode: number }>(
      `/api/rewards/${rewardId}`,
      {
        method: 'DELETE',
        headers: {
          cookie: cookie,
        },
      }
    )

    // DELETE requests with 204 status return null body, so we just verify no error occurred
    expect(response).toBeDefined()
    expect(response.statusCode).toBe(204)
  })

  it('should reject reward deletion without parent session', async () => {
    // Login as child to get session cookie
    const cookie = await getSessionCookie(
      TEST_CHILD_USER.username,
      TEST_CHILD_USER.password
    )

    try {
      await $fetch('/api/rewards/1', {
        method: 'DELETE',
        headers: {
          cookie: cookie,
        },
      })
    } catch (error: any) {
      // Should fail with 403 since child user can't delete rewards
      expect(error).toBeDefined()
      expect(error.status).toBe(403)
      return
    }
    expect.fail('Should have thrown an error')
  })

  it('should reject access to non-existent reward', async () => {
    // Login as parent to get session cookie
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    try {
      await $fetch('/api/rewards/999999999', {
        method: 'GET',
        headers: {
          cookie: cookie,
        },
      })
    } catch (error: any) {
      // Should fail with 404 since reward doesn't exist
      expect(error).toBeDefined()
      expect(error.status).toBe(404)
      return
    }
    expect.fail('Should have thrown an error')
  })
})
