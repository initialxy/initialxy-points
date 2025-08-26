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
import { TaskResponse, TasksResponse } from '../../shared/types'

describe('Tasks API', async () => {
  await setup({
    build: true,
    server: true,
    browser: false,
  })

  beforeEach(async () => {
    await resetDb()
    await createDbAuthTestData()
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

    const response = await $fetch<TasksResponse>(
      `/api/tasks?child_id=${childUser.id}`,
      {
        method: 'GET',
        headers: {
          cookie: cookie,
        },
      }
    )

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

    // Use a non-existent task ID that's not in the database
    const fakeTaskId = 999

    try {
      await $fetch(`/api/tasks/${fakeTaskId}`, {
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
})
