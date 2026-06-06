import { expect, test } from '@playwright/test'

test.describe('Proton Unlimited', () => {
  test('affiche les widgets et les remontées', async ({ page }) => {
    await page.goto('/proton')
    await expect(page.getByRole('heading', { name: 'Proton Unlimited' })).toBeVisible()
    await expect(page.getByText('Proton Authenticator')).toBeVisible()
    await expect(page.getByText('Facture OVH')).toBeVisible()
    await expect(page.getByText('Stockage Unlimited')).toBeVisible()
  })
})
