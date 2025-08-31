import { expect, test } from '@nuxt/test-utils/playwright'
import {
  createAuthTestData,
  createTestTask,
  getUserByUsername,
  playwrightLogin,
  resetDb,
  TEST_CHILD_USER,
  TEST_PARENT_USER,
} from '../utils/index'

test.describe('Task management', () => {
  test.beforeEach(async ({ page, goto }) => {
    await resetDb()
    await createAuthTestData()
  })

  test('Parent user can create a new task', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })
    await playwrightLogin(
      page,
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    const childUser = await getUserByUsername(TEST_CHILD_USER.username)

    // Navigate to child profile page
    await goto(`/child/${childUser.id}`, { waitUntil: 'hydration' })
    await page.waitForURL(`**/child/${childUser.id}`)

    await page.getByTestId('app-action-button').click()
    await page.getByTestId('create-task-button').click()

    // Fill in task details
    await page.getByTestId('description-input').fill('New test task')
    await page.getByTestId('points-input').fill('10')
    await page
      .locator('select[name="recurrenceType"]')
      .selectOption('single-use')

    // Submit the form
    await page.getByTestId('submit-item-button').click()

    // Wait for the new task to appear in the list
    await expect(page.getByTestId('task-description')).toHaveText(
      'New test task'
    )
  })

  test('Parent user can edit an existing task', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })
    await playwrightLogin(
      page,
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    const childUser = await getUserByUsername(TEST_CHILD_USER.username)
    const parentUser = await getUserByUsername(TEST_PARENT_USER.username)

    // Create a test task first
    await createTestTask(
      parentUser.id,
      childUser.id,
      'Original task description',
      5
    )

    // Navigate to child profile page
    await goto(`/child/${childUser.id}`, { waitUntil: 'hydration' })
    await page.waitForURL(`**/child/${childUser.id}`)

    // Edit the existing task
    await page.getByTestId('edit-task-button').click()

    // Update task details
    await page.getByTestId('description-input').fill('Updated task description')
    await page.getByTestId('points-input').fill('15')
    await page
      .locator('select[name="recurrenceType"]')
      .selectOption('perpetual')

    // Submit the form
    await page.getByTestId('submit-item-button').click()

    // Wait for the updated task to appear in the list
    await expect(page.getByTestId('task-description')).toHaveText(
      'Updated task description'
    )
  })

  test('Parent user can delete an existing task', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })
    await playwrightLogin(
      page,
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    const childUser = await getUserByUsername(TEST_CHILD_USER.username)
    const parentUser = await getUserByUsername(TEST_PARENT_USER.username)

    // Create a test task first
    await createTestTask(parentUser.id, childUser.id, 'Task to delete', 5)

    // Navigate to child profile page
    await page.getByTestId('child-card').first().click()
    await page.waitForURL(`**/child/${childUser.id}`)

    // Delete the task
    await page.getByTestId('delete-task-button').click()

    // Confirm deletion
    await page.getByTestId('confirm-delete-button').click()

    // Wait for the task to be removed from the list
    await expect(page.getByTestId('task-description')).not.toBeAttached()
  })

  test('Parent user can approve an existing task', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })
    await playwrightLogin(
      page,
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    const childUser = await getUserByUsername(TEST_CHILD_USER.username)
    const parentUser = await getUserByUsername(TEST_PARENT_USER.username)

    // Create a test task first
    await createTestTask(parentUser.id, childUser.id, 'Task to approve', 5)

    // Navigate to child profile page
    await page.getByTestId('child-card').first().click()
    await page.waitForURL(`**/child/${childUser.id}`)

    // Approve the task as complete (this will make it appear in the UI)
    await page.getByTestId('complete-task-button').click()

    // Verify that child points are updated (should be 5 now)
    const pointsElement = page.getByTestId('child-points-display')
    await expect(pointsElement).toContainText('5')
  })

  test('Child user can mark task as complete and reject it', async ({
    page,
    goto,
  }) => {
    const childUser = await getUserByUsername(TEST_CHILD_USER.username)
    const parentUser = await getUserByUsername(TEST_PARENT_USER.username)

    // Create a test task first
    await createTestTask(parentUser.id, childUser.id, 'Task to complete', 5)

    // Login as child user
    await goto('/', { waitUntil: 'hydration' })
    await playwrightLogin(
      page,
      TEST_CHILD_USER.username,
      TEST_CHILD_USER.password
    )

    // Mark the task as complete
    await page.getByTestId('complete-task-button').click()

    await expect(page.getByTestId('complete-task-button')).not.toBeVisible()
    await expect(page.getByTestId('reject-task-button')).toBeVisible()
    await expect(page.getByTestId('pending-state-badge')).not.toBeVisible()
    await expect(page.getByTestId('alerted-state-badge')).toBeVisible()

    // Click on reject button
    await page.getByTestId('reject-task-button').click()

    await expect(page.getByTestId('reject-task-button')).not.toBeVisible()
    await expect(page.getByTestId('complete-task-button')).toBeVisible()
    await expect(page.getByTestId('pending-state-badge')).toBeVisible()
    await expect(page.getByTestId('alerted-state-badge')).not.toBeVisible()
  })
})
