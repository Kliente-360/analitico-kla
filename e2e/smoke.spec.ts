import { test, expect, type Page } from '@playwright/test'

async function login(page: Page) {
  await page.goto('/')
  await page.getByLabel('E-mail').fill('admin@kliente360.com')
  await page.getByLabel('Senha').fill('admin123')
  await page.getByRole('button', { name: /entrar/i }).click()
  // Wait for the 500 ms simulated auth delay then the dashboard KPI to appear
  await expect(page.getByText('Receita total')).toBeVisible({ timeout: 10000 })
}

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
    await login(page)
    await expect(page.getByText('Carga atual')).toBeVisible()
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
    await login(page)
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
    await expect(page.getByText('Ir para o conteúdo principal')).toBeAttached()
  })

  test('dashboard has h2 headings', async ({ page }) => {
    await login(page)
    await expect(page.getByRole('heading', { level: 2 }).first()).toBeVisible()
  })
})

test.describe('RawDataPage', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
    await page.getByText('Dados Brutos').click()
    await expect(page.getByPlaceholder(/Buscar/)).toBeVisible({ timeout: 8000 })
  })

  test('CSV export button is present', async ({ page }) => {
    await expect(page.getByText('Exportar CSV')).toBeVisible()
  })

  test('search filters the table', async ({ page }) => {
    await page.getByPlaceholder(/Buscar/).fill('ZZZ_NOTEXIST')
    await expect(page.getByText('Nenhuma filial encontrada')).toBeVisible()
  })

  test('URL reflects sector filter', async ({ page }) => {
    await page.getByRole('combobox').first().selectOption('Varejo')
    await expect(page).toHaveURL(/raw_sector=Varejo/)
  })
})
