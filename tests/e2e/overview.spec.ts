import { expect, test } from '@playwright/test'

test.describe("Vue d'ensemble", () => {
  test("affiche le shell et la page d'accueil", async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/overview$/)
    await expect(page.getByRole('heading', { name: "Vue d'ensemble" })).toBeVisible()
    await expect(page.getByText('Verdex')).toBeVisible()
  })

  test('navigue vers un autre module via la sidebar', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /Projets & Outils/ }).click()
    await expect(page).toHaveURL(/\/projects$/)
    await expect(page.getByRole('heading', { name: 'Projets & Outils' })).toBeVisible()
  })

  test('bascule le thème', async ({ page }) => {
    await page.goto('/')
    const html = page.locator('html')
    await expect(html).toHaveAttribute('data-theme', 'dark')
    await page.getByRole('button', { name: /sombre/ }).click()
    await expect(html).toHaveAttribute('data-theme', 'light')
  })
})
