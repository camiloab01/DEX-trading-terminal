import it, { expect } from '@playwright/test'

it('should load homepage in less than 10 seconds', async ({ page }) => {
  await page.goto('/app')
  const performanceTiming = await page.evaluate(() => performance.getEntriesByType('navigation')[0])
  expect(performanceTiming.duration).toBeLessThan(10 * 1000)
})

it('should render with some content', async ({ page }) => {
  await page.goto('/app/ethereum/pool')
  await expect(page.getByText('Order History')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Connect Wallet' }).first()).toBeVisible()
})
