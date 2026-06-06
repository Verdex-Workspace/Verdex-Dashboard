import { expect, test } from '@playwright/test'

test.describe('Cybersécurité', () => {
  test("parcourt le pipeline jusqu'au rapport et ouvre une vulnérabilité", async ({ page }) => {
    await page.goto('/cyber')
    await expect(page.getByRole('heading', { name: 'Audit de Sécurité' })).toBeVisible()
    await expect(page.getByText('Déposez vos documents')).toBeVisible()

    // Aller à l'étape Rapport
    await page.getByRole('button', { name: /Rapport/ }).click()
    await expect(page.getByText('Score sécurité')).toBeVisible()

    // Ouvrir une vulnérabilité
    await page.locator('.wbox.clickable').first().click()
    const panel = page.locator('.sover.show')
    await expect(panel).toBeVisible()
    await expect(panel.getByText("Pourquoi c'est un risque")).toBeVisible()
    await page.keyboard.press('Escape')
  })
})
