import { describe, it, expect, beforeEach } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import {
  createAuthTestData,
  createTestUser,
  getUserByUsername,
  getSessionCookie,
  resetDb,
  setTestUserPoints,
  TEST_CHILD_USER,
  TEST_PARENT_USER,
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
    await createAuthTestData()
    await setTestUserPoints(TEST_CHILD_USER.username, 200)
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

    // Get the child user by username
    const childUser = await getUserByUsername(TEST_CHILD_USER.username)

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

    // Get the child user by username
    const childUser = await getUserByUsername(TEST_CHILD_USER.username)

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

    // Get the child user by username
    const childUser = await getUserByUsername(TEST_CHILD_USER.username)

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
    const childUser = await getUserByUsername(TEST_CHILD_USER.username)

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
    const childUser = await getUserByUsername(TEST_CHILD_USER.username)

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
  it('should request reward redemption with child session', async () => {
    // Login as parent to get session cookie and create a reward
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    // Get the child user by username
    const childUser = await getUserByUsername(TEST_CHILD_USER.username)

    // Create a reward first
    const createResponse = await $fetch<RewardResponse>('/api/rewards', {
      method: 'POST',
      body: {
        description: 'Test reward for redemption',
        points: 10,
        child_id: childUser.id,
        recurrence_type: 'single-use',
      },
      headers: {
        cookie: cookie,
      },
    })

    const rewardId = createResponse.reward.id

    // Login as child to request redemption
    const childCookie = await getSessionCookie(
      TEST_CHILD_USER.username,
      TEST_CHILD_USER.password
    )

    const response = await $fetch<{
      statusCode: number
      body: { message: string }
    }>(`/api/rewards/${rewardId}/request_redemption`, {
      method: 'POST',
      headers: {
        cookie: childCookie,
      },
    })

    expect(response).toBeDefined()
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBe(
      'Reward redemption requested. Awaiting parent approval.'
    )
  })

  it('should reject reward redemption request without proper authorization', async () => {
    // Login as parent to get session cookie and create a reward
    const parentCookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    // Get the child user by username
    const childUser = await getUserByUsername(TEST_CHILD_USER.username)

    // Create a reward first
    const createResponse = await $fetch<RewardResponse>('/api/rewards', {
      method: 'POST',
      body: {
        description: 'Test reward for redemption',
        points: 10,
        child_id: childUser.id,
        recurrence_type: 'single-use',
      },
      headers: {
        cookie: parentCookie,
      },
    })

    const rewardId = createResponse.reward.id

    // Create an unauthorized user (another child) to test authorization
    await createTestUser('unauthorizedchild', 'unauthorizedpassword', 'child')
    const unauthorizedCookie = await getSessionCookie(
      'unauthorizedchild',
      'unauthorizedpassword'
    )

    // Try to request redemption with unauthorized user
    try {
      await $fetch(`/api/rewards/${rewardId}/request_redemption`, {
        method: 'POST',
        headers: {
          cookie: unauthorizedCookie,
        },
      })
    } catch (error: any) {
      expect(error).toBeDefined()
      expect(error.status).toBe(403)
      return
    }
    expect.fail('Should have thrown an error')
  })

  it('should reject reward redemption request when already requested', async () => {
    // Login as parent to get session cookie and create a reward
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    // Get the child user by username
    const childUser = await getUserByUsername(TEST_CHILD_USER.username)

    // Create a reward first
    const createResponse = await $fetch<RewardResponse>('/api/rewards', {
      method: 'POST',
      body: {
        description: 'Test reward for redemption',
        points: 10,
        child_id: childUser.id,
        recurrence_type: 'single-use',
      },
      headers: {
        cookie: cookie,
      },
    })

    const rewardId = createResponse.reward.id

    // Login as child to request redemption
    const childCookie = await getSessionCookie(
      TEST_CHILD_USER.username,
      TEST_CHILD_USER.password
    )

    // Request redemption first time
    await $fetch(`/api/rewards/${rewardId}/request_redemption`, {
      method: 'POST',
      headers: {
        cookie: childCookie,
      },
    })

    // Try to request redemption again - should fail
    try {
      await $fetch(`/api/rewards/${rewardId}/request_redemption`, {
        method: 'POST',
        headers: {
          cookie: childCookie,
        },
      })
    } catch (error: any) {
      expect(error).toBeDefined()
      expect(error.status).toBe(400)
      return
    }
    expect.fail('Should have thrown an error')
  })

  it('should reject reward redemption request when insufficient points', async () => {
    await setTestUserPoints(TEST_CHILD_USER.username, 50)

    // Login as parent to get session cookie and create a reward with high points
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    // Get the child user by username
    const childUser = await getUserByUsername(TEST_CHILD_USER.username)

    // Create a reward with more points than the child has
    const createResponse = await $fetch<RewardResponse>('/api/rewards', {
      method: 'POST',
      body: {
        description: 'Test reward for redemption',
        points: 100,
        child_id: childUser.id,
        recurrence_type: 'single-use',
      },
      headers: {
        cookie: cookie,
      },
    })

    const rewardId = createResponse.reward.id

    // Login as child to request redemption
    const childCookie = await getSessionCookie(
      TEST_CHILD_USER.username,
      TEST_CHILD_USER.password
    )

    // Try to request redemption with insufficient points - should fail
    try {
      await $fetch(`/api/rewards/${rewardId}/request_redemption`, {
        method: 'POST',
        headers: {
          cookie: childCookie,
        },
      })
    } catch (error: any) {
      expect(error).toBeDefined()
      expect(error.status).toBe(400)
      return
    }
    expect.fail('Should have thrown an error')
  })

  it('should reject reward redemption request with non-existent reward', async () => {
    // Login as child to get session cookie
    const cookie = await getSessionCookie(
      TEST_CHILD_USER.username,
      TEST_CHILD_USER.password
    )

    try {
      await $fetch('/api/rewards/999999999/request_redemption', {
        method: 'POST',
        headers: {
          cookie: cookie,
        },
      })
    } catch (error: any) {
      expect(error).toBeDefined()
      expect(error.status).toBe(404)
      return
    }
    expect.fail('Should have thrown an error')
  })

  it('should reject reward redemption request with invalid reward ID', async () => {
    // Login as child to get session cookie
    const cookie = await getSessionCookie(
      TEST_CHILD_USER.username,
      TEST_CHILD_USER.password
    )

    try {
      await $fetch('/api/rewards/invalid/request_redemption', {
        method: 'POST',
        headers: {
          cookie: cookie,
        },
      })
    } catch (error: any) {
      expect(error).toBeDefined()
      expect(error.status).toBe(400)
      return
    }
    expect.fail('Should have thrown an error')
  })

  it('should reject reward redemption request without parent or child session', async () => {
    try {
      await $fetch('/api/rewards/1/request_redemption', {
        method: 'POST',
      })
    } catch (error: any) {
      expect(error).toBeDefined()
      expect(error.status).toBe(401)
      return
    }
    expect.fail('Should have thrown an error')
  })

  it('should reject reward redemption request with missing session', async () => {
    try {
      await $fetch('/api/rewards/1/request_redemption', {
        method: 'POST',
      })
    } catch (error: any) {
      expect(error).toBeDefined()
      expect(error.status).toBe(401)
      return
    }
    expect.fail('Should have thrown an error')
  })

  it('should perform reward redemption rejection as parent', async () => {
    // Login as parent to get session cookie and create a reward
    const parentCookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    // Get the child user by username
    const childUser = await getUserByUsername(TEST_CHILD_USER.username)

    // Create a reward first
    const createResponse = await $fetch<RewardResponse>('/api/rewards', {
      method: 'POST',
      body: {
        description: 'Test reward for redemption',
        points: 10,
        child_id: childUser.id,
        recurrence_type: 'single-use',
      },
      headers: {
        cookie: parentCookie,
      },
    })

    const rewardId = createResponse.reward.id

    // Request redemption first
    const childCookie = await getSessionCookie(
      TEST_CHILD_USER.username,
      TEST_CHILD_USER.password
    )
    await $fetch(`/api/rewards/${rewardId}/request_redemption`, {
      method: 'POST',
      headers: {
        cookie: childCookie,
      },
    })

    // Try to reject redemption with child session
    const response = await $fetch<{ statusCode: number }>(
      `/api/rewards/${rewardId}/reject_redemption`,
      {
        method: 'POST',
        headers: {
          cookie: parentCookie,
        },
      }
    )
    expect(response).toBeDefined()
    expect(response.statusCode).toBe(200)
  })

  it('should reject reward redemption rejection when not requested', async () => {
    // Login as parent to get session cookie and create a reward
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    // Get the child user by username
    const childUser = await getUserByUsername(TEST_CHILD_USER.username)

    // Create a reward first
    const createResponse = await $fetch<RewardResponse>('/api/rewards', {
      method: 'POST',
      body: {
        description: 'Test reward for redemption',
        points: 10,
        child_id: childUser.id,
        recurrence_type: 'single-use',
      },
      headers: {
        cookie: cookie,
      },
    })

    const rewardId = createResponse.reward.id

    // Try to reject redemption when none was requested - should fail
    try {
      await $fetch(`/api/rewards/${rewardId}/reject_redemption`, {
        method: 'POST',
        headers: {
          cookie: cookie,
        },
      })
    } catch (error: any) {
      expect(error).toBeDefined()
      expect(error.status).toBe(400)
      return
    }
    expect.fail('Should have thrown an error')
  })

  it('should reject reward redemption rejection with non-existent reward', async () => {
    // Login as parent to get session cookie
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    try {
      await $fetch('/api/rewards/999999999/reject_redemption', {
        method: 'POST',
        headers: {
          cookie: cookie,
        },
      })
    } catch (error: any) {
      expect(error).toBeDefined()
      expect(error.status).toBe(404)
      return
    }
    expect.fail('Should have thrown an error')
  })

  it('should reject reward redemption rejection with invalid reward ID', async () => {
    // Login as parent to get session cookie
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    try {
      await $fetch('/api/rewards/invalid/reject_redemption', {
        method: 'POST',
        headers: {
          cookie: cookie,
        },
      })
    } catch (error: any) {
      expect(error).toBeDefined()
      expect(error.status).toBe(400)
      return
    }
    expect.fail('Should have thrown an error')
  })

  it('should approve reward redemption with parent session', async () => {
    // Login as parent to get session cookie and create a reward
    const parentCookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    // Get the child user by username
    const childUser = await getUserByUsername(TEST_CHILD_USER.username)

    // Create a reward first
    const createResponse = await $fetch<RewardResponse>('/api/rewards', {
      method: 'POST',
      body: {
        description: 'Test reward for redemption',
        points: 10,
        child_id: childUser.id,
        recurrence_type: 'single-use',
      },
      headers: {
        cookie: parentCookie,
      },
    })

    const rewardId = createResponse.reward.id

    // Request redemption first
    const childCookie = await getSessionCookie(
      TEST_CHILD_USER.username,
      TEST_CHILD_USER.password
    )
    await $fetch(`/api/rewards/${rewardId}/request_redemption`, {
      method: 'POST',
      headers: {
        cookie: childCookie,
      },
    })

    // Approve redemption with parent session
    const response = await $fetch<{
      statusCode: number
      body: { message: string; pointsEarned: number }
    }>(`/api/rewards/${rewardId}/approve_redemption`, {
      method: 'POST',
      headers: {
        cookie: parentCookie,
      },
    })

    expect(response).toBeDefined()
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBe('Reward completion approved')
    expect(response.body.pointsEarned).toBe(10)

    const updatedChildUser = await getUserByUsername(TEST_CHILD_USER.username)
    expect(updatedChildUser?.points).toBe(190)
  })

  it('should reject reward redemption approval without parent session', async () => {
    // Login as parent to get session cookie and create a reward
    const parentCookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    // Get all users and find the child user
    const childUser = await getUserByUsername(TEST_CHILD_USER.username)

    // Create a reward first
    const createResponse = await $fetch<RewardResponse>('/api/rewards', {
      method: 'POST',
      body: {
        description: 'Test reward for redemption',
        points: 10,
        child_id: childUser.id,
        recurrence_type: 'single-use',
      },
      headers: {
        cookie: parentCookie,
      },
    })

    const rewardId = createResponse.reward.id

    // Request redemption first
    const childCookie = await getSessionCookie(
      TEST_CHILD_USER.username,
      TEST_CHILD_USER.password
    )
    await $fetch(`/api/rewards/${rewardId}/request_redemption`, {
      method: 'POST',
      headers: {
        cookie: childCookie,
      },
    })

    // Try to approve redemption with child session - should fail
    try {
      await $fetch(`/api/rewards/${rewardId}/approve_redemption`, {
        method: 'POST',
        headers: {
          cookie: childCookie,
        },
      })
    } catch (error: any) {
      expect(error).toBeDefined()
      expect(error.status).toBe(403)
      return
    }
    expect.fail('Should have thrown an error')
  })

  it('should reject reward redemption approval with non-existent reward', async () => {
    // Login as parent to get session cookie
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    try {
      await $fetch('/api/rewards/999999999/approve_redemption', {
        method: 'POST',
        headers: {
          cookie: cookie,
        },
      })
    } catch (error: any) {
      expect(error).toBeDefined()
      expect(error.status).toBe(404)
      return
    }
    expect.fail('Should have thrown an error')
  })

  it('should reject reward redemption approval with invalid reward ID', async () => {
    // Login as parent to get session cookie
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    try {
      await $fetch('/api/rewards/invalid/approve_redemption', {
        method: 'POST',
        headers: {
          cookie: cookie,
        },
      })
    } catch (error: any) {
      expect(error).toBeDefined()
      expect(error.status).toBe(400)
      return
    }
    expect.fail('Should have thrown an error')
  })

  it('should reject reward redemption approval when insufficient points', async () => {
    await setTestUserPoints(TEST_CHILD_USER.username, 50)

    // Login as parent to get session cookie and create a reward with high points
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    // Get all users and find the child user
    const childUser = await getUserByUsername(TEST_CHILD_USER.username)

    // Create a reward with more points than the child has
    const createResponse = await $fetch<RewardResponse>('/api/rewards', {
      method: 'POST',
      body: {
        description: 'Test reward for redemption',
        points: 100,
        child_id: childUser.id,
        recurrence_type: 'single-use',
      },
      headers: {
        cookie: cookie,
      },
    })

    const rewardId = createResponse.reward.id

    // Try to approve redemption with insufficient points - should fail
    try {
      await $fetch(`/api/rewards/${rewardId}/approve_redemption`, {
        method: 'POST',
        headers: {
          cookie: cookie,
        },
      })
    } catch (error: any) {
      expect(error).toBeDefined()
      expect(error.status).toBe(400)
      return
    }
    expect.fail('Should have thrown an error')
  })
})
