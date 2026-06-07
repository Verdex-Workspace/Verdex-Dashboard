import { expect, test } from '@playwright/test'

test.describe('Ticketing', () => {
  test("affiche le Kanban et ouvre le détail d'un ticket", async ({ page }) => {
    await page.goto('/ticketing')
    await expect(page.getByRole('heading', { name: /Tickets/ })).toBeVisible()
    await expect(page.getByText('Backlog', { exact: true })).toBeVisible()

    await page.locator('.wbox.clickable').first().click()
    const panel = page.locator('.sover.show')
    await expect(panel).toBeVisible()
    await expect(panel.getByText('Pousser sur GitHub')).toBeVisible()
    await expect(panel.getByText('Actions')).toBeVisible()
    await page.keyboard.press('Escape')
  })

  test('bascule entre les vues', async ({ page }) => {
    await page.goto('/ticketing')
    const tabs = page.getByRole('tablist')

    await tabs.getByRole('tab', { name: 'Table' }).click()
    await expect(page.getByText('ÉCHÉANCE')).toBeVisible()

    await tabs.getByRole('tab', { name: 'Roadmap' }).click()
    await expect(page.getByText('v1.2', { exact: true })).toBeVisible()

    await tabs.getByRole('tab', { name: 'Gantt' }).click()
    await expect(page.getByText('chemin critique')).toBeVisible()

    await tabs.getByRole('tab', { name: 'Priorisation' }).click()
    await expect(page.getByText('QUICK WINS')).toBeVisible()
  })
})
