import { test, expect } from '@playwright/test'

test.describe('Login flow', () => {
  test('shows login page on first load', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByLabel('E-mail')).toBeVisible()
    await expect(page.getByLabel('Senha')).toBeVisible()
    await expect(page.getByRole('button', { name: /entrar/i })).toBeVisible()
  })

  test('fills demo credentials on click', async ({ page }) => {
    await page.goto('/')
    await page.getByText('admin@kliente360.com').first().click()
    await expect(page.getByLabel('E-mail')).toHaveValue('admin@kliente360.com')
  })

  test('logs in with admin credentials and reaches dashboard', async ({ page }) => {
    await page.goto('/')
    await page.getByLabel('E-mail').fill('admin@kliente360.com')
    await page.getByLabel('Senha').fill('admin123')
    await page.getByRole('button', { name: /entrar/i }).click()
    await page.waitForLoadState('networkidle')
    await expect(page.getByText('Receita total')).toBeVisible({ timeout: 8000 })
  })

  test('shows error on wrong credentials', async ({ page }) => {
    await page.goto('/')
    await page.getByLabel('E-mail').fill('wrong@example.com')
    await page.getByLabel('Senha').fill('wrongpassword')
    await page.getByRole('button', { name: /entrar/i }).click()
    await expect(page.getByRole('alert')).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByLabel('E-mail').fill('admin@kliente360.com')
    await page.getByLabel('Senha').fill('admin123')
    await page.getByRole('button', { name: /entrar/i }).click()
    await page.waitForLoadState('networkidle')
    await expect(page.getByText('Receita total')).toBeVisible({ timeout: 8000 })
  })

  test('navigates to Pivot Table page', async ({ page }) => {
    await page.getByText('Análise Multidimensional').click()
    await expect(page.getByText('Linhas')).toBeVisible()
  })

  test('navigates to Scenario page', async ({ page }) => {
    await page.getByText('Simulação de Cenários').click()
    await expect(page.getByText(/CBS/).first()).toBeVisible()
  })

  test('navigates to Sector page', async ({ page }) => {
    await page.getByText('Linha de Negócio').click()
    await expect(page.getByText('Carga por linha de negócio')).toBeVisible()
  })

  test('navigates to Regional page', async ({ page }) => {
    await page.getByText('Por Filial / UF').click()
    await expect(page.getByText('Por Filial / UF').nth(1)).toBeVisible()
  })
})

test.describe('Accessibility', () => {
  test('skip-to-content link is present', async ({ page }) => {
    await page.goto('/')
    const skipLink = page.getByText('Ir para o conteúdo principal')
    await expect(skipLink).toBeAttached()
  })

  test('dashboard has no detectable heading structure issues', async ({ page }) => {
    await page.goto('/')
    await page.getByLabel('E-mail').fill('admin@kliente360.com')
    await page.getByLabel('Senha').fill('admin123')
    await page.getByRole('button', { name: /entrar/i }).click()
    await page.waitForLoadState('networkidle')
    await expect(page.getByText('Receita total')).toBeVisible({ timeout: 8000 })
    const h2 = page.getByRole('heading', { level: 2 })
    await expect(h2.first()).toBeVisible()
  })
})

test.describe('RawDataPage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByLabel('E-mail').fill('admin@kliente360.com')
    await page.getByLabel('Senha').fill('admin123')
    await page.getByRole('button', { name: /entrar/i }).click()
    await page.waitForLoadState('networkidle')
    await expect(page.getByText('Receita total')).toBeVisible({ timeout: 8000 })
    await page.getByText('Dados Brutos').click()
    await expect(page.getByPlaceholder(/Buscar/)).toBeVisible({ timeout: 8000 })
  })

  test('CSV export button is present', async ({ page }) => {
    await expect(page.getByText('Exportar CSV')).toBeVisible()
  })

  test('search filters the table', async ({ page }) => {
    const input = page.getByPlaceholder(/Buscar/)
    await input.fill('ZZZ_NOTEXIST')
    await expect(page.getByText('Nenhuma filial encontrada')).toBeVisible()
  })

  test('URL reflects filter state', async ({ page }) => {
    const select = page.getByRole('combobox').first()
    await select.selectOption('Varejo')
    await expect(page).toHaveURL(/raw_sector=Varejo/)
  })
})
