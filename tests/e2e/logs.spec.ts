import { expect, test } from '@playwright/test'

test.describe('Logs & Métriques', () => {
  test('affiche les KPIs et le flux de logs', async ({ page }) => {
    await page.goto('/logs')
    await expect(page.getByRole('heading', { name: 'Logs & Métriques' })).toBeVisible()
    await expect(page.getByText('Flux de logs')).toBeVisible()
    await expect(page.getByText('502 upstream api-novaweb:4012')).toBeVisible()
  })

  test('filtre le flux via la barre de requête', async ({ page }) => {
    await page.goto('/logs')
    await page.getByPlaceholder(/source=/).fill('disk')
    await expect(page.getByText('disk /var 81%')).toBeVisible()
    await expect(page.getByText('502 upstream api-novaweb:4012')).toHaveCount(0)
  })
})
