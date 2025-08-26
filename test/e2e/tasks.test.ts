import { describe, it, expect, beforeEach } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import {
  createAuthTestData,
  createTestUser,
  getAllUsers,
  getSessionCookie,
  resetDb,
  TEST_CHILD_USER,
  TEST_PARENT_USER,
} from '../utils/index'
import { TaskResponse, TasksResponse } from '../../shared/types'

describe('Tasks API', async () => {
  await setup({
    build: true,
    server: true,
    browser: false,
  })

  beforeEach(async () => {
    await resetDb()
    await createAuthTestData()
  })

  it('should get all tasks with parent session', async () => {
    // Login as parent to get session cookie
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    const response = await $fetch<TasksResponse>('/api/tasks', {
      method: 'GET',
      headers: {
        cookie: cookie,
      },
    })

    expect(response).toBeDefined()
    expect(response.tasks).toBeDefined()
  })

  it('should get all tasks with child session (filtered by own tasks)', async () => {
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

    const response = await $fetch<TasksResponse>('/api/tasks', {
      method: 'GET',
      headers: {
        cookie: cookie,
      },
      query: {
        child_id: childUser.id,
      },
    })

    expect(response).toBeDefined()
    expect(response.tasks).toBeDefined()
  })

  it('should get tasks for specific child with parent session', async () => {
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

    const response = await $fetch<TasksResponse>('/api/tasks', {
      method: 'GET',
      headers: {
        cookie: cookie,
      },
      query: {
        child_id: childUser.id,
      },
    })

    expect(response).toBeDefined()
    expect(response.tasks).toBeDefined()
  })

  it('should create task with parent session', async () => {
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

    const response = await $fetch<TaskResponse>('/api/tasks', {
      method: 'POST',
      body: {
        description: 'Test task',
        points: 10,
        child_id: childUser.id,
        recurrence_type: 'single-use',
      },
      headers: {
        cookie: cookie,
      },
    })

    expect(response).toBeDefined()
    expect(response.task).toBeDefined()
    expect(response.task.description).toBe('Test task')
    expect(response.task.points).toBe(10)
    expect(response.task.child_id).toBe(childUser.id)
  })

  it('should reject task creation without parent session', async () => {
    // Login as child to get session cookie
    const cookie = await getSessionCookie(
      TEST_CHILD_USER.username,
      TEST_CHILD_USER.password
    )

    try {
      await $fetch('/api/tasks', {
        method: 'POST',
        body: {
          description: 'Test task',
          points: 10,
          child_id: 1,
          recurrence_type: 'single-use',
        },
        headers: {
          cookie: cookie,
        },
      })
    } catch (error: any) {
      // Should fail with 403 since child user can't create tasks
      expect(error).toBeDefined()
      expect(error.status).toBe(403)
      return
    }
    expect.fail('Should have thrown an error')
  })

  it('should reject task creation with missing fields', async () => {
    // Login as parent to get session cookie
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    try {
      await $fetch('/api/tasks', {
        method: 'POST',
        body: {
          description: 'Test task',
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

  it('should update task with parent session', async () => {
    // Login as parent to get session cookie
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    // First create a task to update
    const allUsers = await getAllUsers()
    const childUser = allUsers.find(
      (user) => user.username === TEST_CHILD_USER.username
    )

    if (!childUser) {
      throw new Error('Child user not found in database')
    }

    const createResponse = await $fetch<TaskResponse>('/api/tasks', {
      method: 'POST',
      body: {
        description: 'Original task',
        points: 10,
        child_id: childUser.id,
        recurrence_type: 'single-use',
      },
      headers: {
        cookie: cookie,
      },
    })

    const taskId = createResponse.task.id

    const response = await $fetch<TaskResponse>(`/api/tasks/${taskId}`, {
      method: 'PUT',
      body: {
        description: 'Updated task',
        points: 20,
        recurrence_type: 'perpetual',
      },
      headers: {
        cookie: cookie,
      },
    })

    expect(response).toBeDefined()
    expect(response.task).toBeDefined()
    expect(response.task.description).toBe('Updated task')
    expect(response.task.points).toBe(20)
  })

  it('should reject task update without parent session', async () => {
    // Login as child to get session cookie
    const cookie = await getSessionCookie(
      TEST_CHILD_USER.username,
      TEST_CHILD_USER.password
    )

    try {
      await $fetch('/api/tasks/1', {
        method: 'PUT',
        body: {
          description: 'Updated task',
          points: 20,
          recurrence_type: 'perpetual',
        },
        headers: {
          cookie: cookie,
        },
      })
    } catch (error: any) {
      // Should fail with 403 since child user can't update tasks
      expect(error).toBeDefined()
      expect(error.status).toBe(403)
      return
    }
    expect.fail('Should have thrown an error')
  })

  it('should delete task with parent session', async () => {
    // Login as parent to get session cookie
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    // First create a task to delete
    const allUsers = await getAllUsers()
    const childUser = allUsers.find(
      (user) => user.username === TEST_CHILD_USER.username
    )

    if (!childUser) {
      throw new Error('Child user not found in database')
    }

    const createResponse = await $fetch<TaskResponse>('/api/tasks', {
      method: 'POST',
      body: {
        description: 'Task to delete',
        points: 10,
        child_id: childUser.id,
        recurrence_type: 'single-use',
      },
      headers: {
        cookie: cookie,
      },
    })

    const taskId = createResponse.task.id

    const response = await $fetch<{ statusCode: number }>(
      `/api/tasks/${taskId}`,
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

  it('should reject task deletion without parent session', async () => {
    // Login as child to get session cookie
    const cookie = await getSessionCookie(
      TEST_CHILD_USER.username,
      TEST_CHILD_USER.password
    )

    try {
      await $fetch('/api/tasks/1', {
        method: 'DELETE',
        headers: {
          cookie: cookie,
        },
      })
    } catch (error: any) {
      // Should fail with 403 since child user can't delete tasks
      expect(error).toBeDefined()
      expect(error.status).toBe(403)
      return
    }
    expect.fail('Should have thrown an error')
  })

  it('should reject access to non-existent task', async () => {
    // Login as parent to get session cookie
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    try {
      await $fetch('/api/tasks/999999999', {
        method: 'GET',
        headers: {
          cookie: cookie,
        },
      })
    } catch (error: any) {
      // Should fail with 404 since task doesn't exist
      expect(error).toBeDefined()
      expect(error.status).toBe(404)
      return
    }
    expect.fail('Should have thrown an error')
  })
  it('should mark task as complete with child session', async () => {
    // Login as parent to get session cookie and create a task
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

    // Create a task first
    const createResponse = await $fetch<TaskResponse>('/api/tasks', {
      method: 'POST',
      body: {
        description: 'Test task for completion',
        points: 10,
        child_id: childUser.id,
        recurrence_type: 'single-use',
      },
      headers: {
        cookie: cookie,
      },
    })

    const taskId = createResponse.task.id

    // Login as child to mark task complete
    const childCookie = await getSessionCookie(
      TEST_CHILD_USER.username,
      TEST_CHILD_USER.password
    )

    const response = await $fetch<{
      statusCode: number
      body: { message: string }
    }>(`/api/tasks/${taskId}/mark_complete`, {
      method: 'POST',
      headers: {
        cookie: childCookie,
      },
    })

    expect(response).toBeDefined()
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBe(
      'Task marked as completed. Awaiting parent approval.'
    )
  })

  it('should reject marking task as complete without proper authorization', async () => {
    // Login as parent to get session cookie and create a task
    const parentCookie = await getSessionCookie(
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

    // Create a task first
    const createResponse = await $fetch<TaskResponse>('/api/tasks', {
      method: 'POST',
      body: {
        description: 'Test task for completion',
        points: 10,
        child_id: childUser.id,
        recurrence_type: 'single-use',
      },
      headers: {
        cookie: parentCookie,
      },
    })

    const taskId = createResponse.task.id

    // Create an unauthorized user (another child) to test authorization
    await createTestUser('unauthorizedchild', 'unauthorizedpassword', 'child')
    const unauthorizedCookie = await getSessionCookie(
      'unauthorizedchild',
      'unauthorizedpassword'
    )

    // Try to mark task complete with unauthorized user
    try {
      await $fetch(`/api/tasks/${taskId}/mark_complete`, {
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

  it('should reject marking task as complete if already marked', async () => {
    // Login as parent to get session cookie and create a task
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

    // Create a task first
    const createResponse = await $fetch<TaskResponse>('/api/tasks', {
      method: 'POST',
      body: {
        description: 'Test task for completion',
        points: 10,
        child_id: childUser.id,
        recurrence_type: 'single-use',
      },
      headers: {
        cookie: cookie,
      },
    })

    const taskId = createResponse.task.id

    // Login as child to mark task complete
    const childCookie = await getSessionCookie(
      TEST_CHILD_USER.username,
      TEST_CHILD_USER.password
    )

    // Mark task complete first time
    await $fetch(`/api/tasks/${taskId}/mark_complete`, {
      method: 'POST',
      headers: {
        cookie: childCookie,
      },
    })

    // Try to mark the same task complete again (should fail)
    try {
      await $fetch(`/api/tasks/${taskId}/mark_complete`, {
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

  it('should reject marking non-existent task as complete', async () => {
    // Login as child to get session cookie
    const cookie = await getSessionCookie(
      TEST_CHILD_USER.username,
      TEST_CHILD_USER.password
    )

    try {
      await $fetch('/api/tasks/999999999/mark_complete', {
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

  it('should reject marking task as complete with invalid task ID', async () => {
    // Login as child to get session cookie
    const cookie = await getSessionCookie(
      TEST_CHILD_USER.username,
      TEST_CHILD_USER.password
    )

    try {
      await $fetch('/api/tasks/invalid/mark_complete', {
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

  it('should reject task completion rejection without proper authorization', async () => {
    // Login as parent to get session cookie and create a task
    const parentCookie = await getSessionCookie(
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

    // Create a task first
    const createResponse = await $fetch<TaskResponse>('/api/tasks', {
      method: 'POST',
      body: {
        description: 'Test task for completion',
        points: 10,
        child_id: childUser.id,
        recurrence_type: 'single-use',
      },
      headers: {
        cookie: parentCookie,
      },
    })

    const taskId = createResponse.task.id

    // Login as child to mark task complete
    const childCookie = await getSessionCookie(
      TEST_CHILD_USER.username,
      TEST_CHILD_USER.password
    )

    // Mark task complete first
    await $fetch(`/api/tasks/${taskId}/mark_complete`, {
      method: 'POST',
      headers: {
        cookie: childCookie,
      },
    })

    // Create an unauthorized user (another child) to test authorization
    await createTestUser('unauthorizedchild', 'unauthorizedpassword', 'child')
    const unauthorizedCookie = await getSessionCookie(
      'unauthorizedchild',
      'unauthorizedpassword'
    )

    // Try to reject completion with unauthorized user
    try {
      await $fetch(`/api/tasks/${taskId}/reject_complete`, {
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

  it('should reject task completion rejection if not marked complete yet', async () => {
    // Login as parent to get session cookie and create a task
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

    // Create a task first
    const createResponse = await $fetch<TaskResponse>('/api/tasks', {
      method: 'POST',
      body: {
        description: 'Test task for completion',
        points: 10,
        child_id: childUser.id,
        recurrence_type: 'single-use',
      },
      headers: {
        cookie: cookie,
      },
    })

    const taskId = createResponse.task.id

    // Login as child to get session cookie
    const childCookie = await getSessionCookie(
      TEST_CHILD_USER.username,
      TEST_CHILD_USER.password
    )

    // Try to reject completion without marking complete first (should fail)
    try {
      await $fetch(`/api/tasks/${taskId}/reject_complete`, {
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

  it('should reject task completion rejection for non-existent task', async () => {
    // Login as child to get session cookie
    const cookie = await getSessionCookie(
      TEST_CHILD_USER.username,
      TEST_CHILD_USER.password
    )

    try {
      await $fetch('/api/tasks/999999999/reject_complete', {
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

  it('should approve task completion with parent session', async () => {
    // Login as parent to get session cookie and create a task
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

    // Create a task first
    const createResponse = await $fetch<TaskResponse>('/api/tasks', {
      method: 'POST',
      body: {
        description: 'Test task for completion',
        points: 10,
        child_id: childUser.id,
        recurrence_type: 'single-use',
      },
      headers: {
        cookie: cookie,
      },
    })

    const taskId = createResponse.task.id

    // Login as child to mark task complete
    const childCookie = await getSessionCookie(
      TEST_CHILD_USER.username,
      TEST_CHILD_USER.password
    )

    // Mark task complete first
    await $fetch(`/api/tasks/${taskId}/mark_complete`, {
      method: 'POST',
      headers: {
        cookie: childCookie,
      },
    })

    // Login as parent to approve completion
    const parentCookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    const response = await $fetch<{
      statusCode: number
      body: { message: string; pointsEarned: number }
    }>(`/api/tasks/${taskId}/approve_complete`, {
      method: 'POST',
      headers: {
        cookie: parentCookie,
      },
    })

    expect(response).toBeDefined()
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBe('Task completion approved')
    expect(response.body.pointsEarned).toBe(10)

    const refetchAllUsers = await getAllUsers()
    const updatedChildUser = refetchAllUsers.find(
      (user) => user.username === TEST_CHILD_USER.username
    )
    expect(updatedChildUser?.points).toBe(10)
  })

  it('should reject task completion approval without proper authorization', async () => {
    // Login as parent to get session cookie and create a task
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

    // Create a task first
    const createResponse = await $fetch<TaskResponse>('/api/tasks', {
      method: 'POST',
      body: {
        description: 'Test task for completion',
        points: 10,
        child_id: childUser.id,
        recurrence_type: 'single-use',
      },
      headers: {
        cookie: cookie,
      },
    })

    const taskId = createResponse.task.id

    // Login as child to mark task complete
    const childCookie = await getSessionCookie(
      TEST_CHILD_USER.username,
      TEST_CHILD_USER.password
    )

    // Mark task complete first
    await $fetch(`/api/tasks/${taskId}/mark_complete`, {
      method: 'POST',
      headers: {
        cookie: childCookie,
      },
    })

    // Try to approve completion with a different user (not parent)
    try {
      await $fetch(`/api/tasks/${taskId}/approve_complete`, {
        method: 'POST',
        headers: {
          cookie: childCookie, // Using child's cookie
        },
      })
    } catch (error: any) {
      expect(error).toBeDefined()
      expect(error.status).toBe(403)
      return
    }
    expect.fail('Should have thrown an error')
  })

  it('should reject task completion approval for non-existent task', async () => {
    // Login as parent to get session cookie
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    try {
      await $fetch('/api/tasks/999999999/approve_complete', {
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

  it('should handle perpetual task completion approval correctly', async () => {
    // Login as parent to get session cookie and create a task
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

    // Create a perpetual task first
    const createResponse = await $fetch<TaskResponse>('/api/tasks', {
      method: 'POST',
      body: {
        description: 'Test perpetual task for completion',
        points: 10,
        child_id: childUser.id,
        recurrence_type: 'perpetual',
      },
      headers: {
        cookie: cookie,
      },
    })

    const taskId = createResponse.task.id

    const response = await $fetch<{
      statusCode: number
      body: { message: string; pointsEarned: number }
    }>(`/api/tasks/${taskId}/approve_complete`, {
      method: 'POST',
      headers: {
        cookie: cookie,
      },
    })

    expect(response).toBeDefined()
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBe('Task completion approved')
    expect(response.body.pointsEarned).toBe(10)

    // Verify task is still in database (perpetual tasks don't get deleted)
    const tasksResponse = await $fetch<TasksResponse>('/api/tasks', {
      method: 'GET',
      headers: {
        cookie: cookie,
      },
    })

    const updatedTask = tasksResponse.tasks.find((task) => task.id === taskId)

    expect(updatedTask).toBeDefined()
    expect(updatedTask?.is_marked_complete).toBeFalsy() // Should be reset for perpetual tasks
  })
})
