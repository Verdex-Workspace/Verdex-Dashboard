import { expect, test } from '@playwright/test'

test.describe('Projets & Outils', () => {
  test('affiche les outils et ouvre le panneau de détail', async ({ page }) => {
    await page.goto('/projects')
    await expect(page.getByRole('heading', { name: 'Projets & Outils' })).toBeVisible()

    // Une carte d'outil est visible
    const card = page.locator('.wbox.clickable').first()
    await expect(card).toBeVisible()

    // Clic → le slide-over s'ouvre
    await card.click()
    const panel = page.locator('.sover.show')
    await expect(panel).toBeVisible()

    // Les onglets du détail sont présents
    await expect(panel.getByRole('tab', { name: 'Aperçu' })).toBeVisible()
    await panel.getByRole('tab', { name: /Commits/ }).click()

    // Fermeture via Échap
    await page.keyboard.press('Escape')
    await expect(page.locator('.sover.show')).toHaveCount(0)
  })

  test('filtre les outils via la recherche', async ({ page }) => {
    await page.goto('/projects')
    await page.getByPlaceholder(/rechercher un outil/).fill('auth')
    await expect(page.getByText('auth-gateway')).toBeVisible()
    await expect(page.getByText('novaweb-api')).toHaveCount(0)
  })
})
