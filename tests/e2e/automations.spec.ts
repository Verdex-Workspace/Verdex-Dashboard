import { expect, test } from '@playwright/test'

test.describe('Automations', () => {
  test('affiche le graphe, exécute et montre les logs', async ({ page }) => {
    await page.goto('/automations')
    await expect(page.getByRole('heading', { name: 'Automations & Graphe' })).toBeVisible()
    await expect(page.getByText('Sync CRM → Sheets').first()).toBeVisible()
    await expect(page.getByText('Webhook CRM')).toBeVisible()
    expect(await page.locator('svg line').count()).toBeGreaterThan(0)

    await page.getByRole('button', { name: /exécuter/ }).click()
    await expect(page.getByText('exécution en cours…')).toBeVisible()
    await expect(page.getByText("Logs d'exécution")).toBeVisible()
  })
})
