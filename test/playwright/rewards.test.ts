import { expect, test } from '@nuxt/test-utils/playwright'
import {
  createAuthTestData,
  createTestReward,
  getAllUsers,
  playwrightLogin,
  resetDb,
  setTestUserPoints,
  TEST_CHILD_USER,
  TEST_PARENT_USER,
} from '../utils/index'

const TIMEOUT_MS = 30000 // 30 seconds

test.describe('Reward management', () => {
  test.beforeEach(async ({ page, goto }) => {
    page.setDefaultTimeout(TIMEOUT_MS)
    await resetDb()
    await createAuthTestData()
  })

  test('Parent user can create a new reward', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })
    await playwrightLogin(
      page,
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    const users = await getAllUsers()
    const childUser = users.find(
      (user) => user.username === TEST_CHILD_USER.username
    )
    if (!childUser) {
      throw new Error('Child user not found')
    }

    // Navigate to child profile page
    await goto(`/child/${childUser.id}`, { waitUntil: 'hydration' })
    await page.waitForURL(`**/child/${childUser.id}`)

    // Create a new reward using the modal
    await page.getByTestId('app-action-button').click()
    await page.getByTestId('create-reward-button').click()

    // Fill in reward details
    await page.getByTestId('description-input').fill('New test reward')
    await page.getByTestId('points-input').fill('20')
    await page
      .locator('select[name="recurrenceType"]')
      .selectOption('single-use')

    // Submit the form
    await page.getByTestId('submit-item-button').click()

    // Wait for the new reward to appear in the list
    await expect(page.getByTestId('reward-description')).toHaveText(
      'New test reward'
    )
  })

  test('Parent user can edit an existing reward', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })
    await playwrightLogin(
      page,
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    const users = await getAllUsers()
    const childUser = users.find(
      (user) => user.username === TEST_CHILD_USER.username
    )
    const parentUser = users.find(
      (user) => user.username === TEST_PARENT_USER.username
    )
    if (childUser == null || parentUser == null) {
      throw new Error('Users not found')
    }

    // Create a test reward first
    await createTestReward(
      parentUser.id,
      childUser.id,
      'Original reward description',
      10
    )

    // Navigate to child profile page
    await goto(`/child/${childUser.id}`, { waitUntil: 'hydration' })
    await page.waitForURL(`**/child/${childUser.id}`)

    // Edit the existing reward
    await page.getByTestId('edit-reward-button').click()

    // Update reward details
    await page
      .getByTestId('description-input')
      .fill('Updated reward description')
    await page.getByTestId('points-input').fill('15')
    await page
      .locator('select[name="recurrenceType"]')
      .selectOption('perpetual')

    // Submit the form
    await page.getByTestId('submit-item-button').click()

    // Wait for the updated reward to appear in the list
    await expect(page.getByTestId('reward-description')).toHaveText(
      'Updated reward description'
    )
  })

  test('Parent user can delete an existing reward', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })
    await playwrightLogin(
      page,
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    const users = await getAllUsers()
    const childUser = users.find(
      (user) => user.username === TEST_CHILD_USER.username
    )
    const parentUser = users.find(
      (user) => user.username === TEST_PARENT_USER.username
    )
    if (childUser == null || parentUser == null) {
      throw new Error('Users not found')
    }

    // Create a test reward first
    await createTestReward(parentUser.id, childUser.id, 'Reward to delete', 5)

    // Navigate to child profile page
    await page.getByTestId('child-card').first().click()
    await page.waitForURL(`**/child/${childUser.id}`)

    // Delete the reward
    await page.getByTestId('delete-reward-button').click()

    // Confirm deletion
    await page.getByTestId('confirm-delete-button').click()

    // Wait for the reward to be removed from the list
    await expect(page.getByTestId('reward-description')).not.toBeAttached()
  })

  test('Parent user can approve a reward redemption request', async ({
    page,
    goto,
  }) => {
    await goto('/', { waitUntil: 'hydration' })
    await playwrightLogin(
      page,
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    const users = await getAllUsers()
    const childUser = users.find(
      (user) => user.username === TEST_CHILD_USER.username
    )
    const parentUser = users.find(
      (user) => user.username === TEST_PARENT_USER.username
    )
    if (childUser == null || parentUser == null) {
      throw new Error('Users not found')
    }

    // Create a test reward first
    await createTestReward(parentUser.id, childUser.id, 'Reward to redeem', 5)
    await setTestUserPoints(TEST_CHILD_USER.username, 10)

    // Navigate to child profile page
    await page.getByTestId('child-card').first().click()
    await page.waitForURL(`**/child/${childUser.id}`)

    // Request redemption for the reward
    await page.getByTestId('complete-reward-button').click()

    // Verify that child points are updated (should be 5 deducted)
    const pointsElement = page.getByTestId('child-points-display')
    await expect(pointsElement).toContainText('5')
  })

  test('Child user can request reward redemption', async ({ page, goto }) => {
    const users = await getAllUsers()
    const childUser = users.find(
      (user) => user.username === TEST_CHILD_USER.username
    )
    const parentUser = users.find(
      (user) => user.username === TEST_PARENT_USER.username
    )
    if (childUser == null || parentUser == null) {
      throw new Error('Users not found')
    }

    // Create a test reward first
    await createTestReward(parentUser.id, childUser.id, 'Reward to complete', 5)
    await setTestUserPoints(TEST_CHILD_USER.username, 10)

    // Login as child user
    await goto('/', { waitUntil: 'hydration' })
    await playwrightLogin(
      page,
      TEST_CHILD_USER.username,
      TEST_CHILD_USER.password
    )

    // Mark the reward as complete
    await page.getByTestId('complete-reward-button').click()

    await expect(page.getByTestId('complete-reward-button')).not.toBeVisible()
    await expect(page.getByTestId('reject-reward-button')).toBeVisible()

    // Click on reject button
    await page.getByTestId('reject-reward-button').click()

    await expect(page.getByTestId('reject-reward-button')).not.toBeVisible()
    await expect(page.getByTestId('complete-reward-button')).toBeVisible()
  })
})
