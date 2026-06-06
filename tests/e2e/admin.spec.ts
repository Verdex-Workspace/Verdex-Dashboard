import { expect, test } from '@playwright/test'

test.describe('Admin / Infra', () => {
  test('affiche les ports et bascule entre les onglets', async ({ page }) => {
    await page.goto('/admin')
    await expect(page.getByRole('heading', { name: 'Admin / Infra' })).toBeVisible()
    await expect(page.getByText('5432').first()).toBeVisible()

    await page.getByRole('tablist').getByRole('tab', { name: 'Docker' }).click()
    await expect(page.getByText('docker-compose.yml')).toBeVisible()

    await page.getByRole('tablist').getByRole('tab', { name: 'Scripts' }).click()
    await expect(page.getByText('verdex-dashboard')).toBeVisible()
  })
})
