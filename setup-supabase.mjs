/**
 * Setup Supabase for Analitico KLA
 * Run once locally: node setup-supabase.mjs
 * Then delete this file — the PAT is sensitive.
 */

import { writeFileSync, existsSync } from 'fs'

const PAT     = 'sbp_f1d2d3209a52c2ec421fece5d1c2a8c9012c5fb0'
const MGMT    = 'https://api.supabase.com'
const REGION  = 'sa-east-1'
const PROJECT = 'analitico-kla'
const DB_PASS = 'Kla2025#Reform@' // strong default — change if you want

const DEMO_USERS = [
  { email: 'admin@kliente360.com',  password: 'admin123',   name: 'Administrador'     },
  { email: 'demo@kliente360.com',   password: 'demo@2025',  name: 'Demo Kliente 360'  },
]

// ─── helpers ──────────────────────────────────────────────────────────────────

const mgmt = (path, opts = {}) =>
  fetch(`${MGMT}${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${PAT}`,
      'Content-Type': 'application/json',
      ...(opts.headers ?? {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  }).then(async (r) => {
    const text = await r.text()
    const json = text ? JSON.parse(text) : {}
    if (!r.ok) throw new Error(`${r.status} ${path}: ${JSON.stringify(json)}`)
    return json
  })

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const log = (msg) => console.log(`[setup] ${msg}`)

// ─── 1. resolve org ───────────────────────────────────────────────────────────

log('Buscando organização...')
const orgs = await mgmt('/v1/organizations')
if (!orgs.length) throw new Error('Nenhuma organização encontrada. Crie uma em supabase.com/dashboard.')
const orgId = orgs[0].id
log(`Organização: ${orgs[0].name} (${orgId})`)

// ─── 2. check / create project ───────────────────────────────────────────────

log('Verificando projetos existentes...')
const projects = await mgmt('/v1/projects')
let project = projects.find((p) => p.name === PROJECT)

if (project) {
  log(`Projeto "${PROJECT}" já existe (ref: ${project.id}) — pulando criação.`)
} else {
  log(`Criando projeto "${PROJECT}" na região ${REGION}...`)
  project = await mgmt('/v1/projects', {
    method: 'POST',
    body: { name: PROJECT, organization_id: orgId, region: REGION, db_pass: DB_PASS },
  })
  log(`Projeto criado: ${project.id}`)

  // wait for project to become healthy
  log('Aguardando projeto ficar ativo (pode levar 1-2 min)...')
  for (let i = 0; i < 24; i++) {
    await sleep(5000)
    const status = await mgmt(`/v1/projects/${project.id}`)
    process.stdout.write('.')
    if (status.status === 'ACTIVE_HEALTHY') { console.log(' ativo!'); break }
    if (i === 23) throw new Error('Timeout: projeto não ficou ativo em 2 min.')
  }
}

const ref = project.id

// ─── 3. get API keys ─────────────────────────────────────────────────────────

log('Obtendo chaves de API...')
const keys = await mgmt(`/v1/projects/${ref}/api-keys`)
const anon        = keys.find((k) => k.name === 'anon')?.api_key
const serviceRole = keys.find((k) => k.name === 'service_role')?.api_key
if (!anon || !serviceRole) throw new Error(`Chaves não encontradas: ${JSON.stringify(keys)}`)
const projectUrl = `https://${ref}.supabase.co`
log(`URL: ${projectUrl}`)

// ─── 4. disable email confirmation ───────────────────────────────────────────

log('Desativando confirmação de e-mail (modo demo)...')
await mgmt(`/v1/projects/${ref}/config/auth`, {
  method: 'PATCH',
  body: { mailer_autoconfirm: true },
}).catch((e) => log(`Aviso config auth: ${e.message}`))

// ─── 5. create demo users ────────────────────────────────────────────────────

log('Criando usuários demo...')
for (const u of DEMO_USERS) {
  const res = await fetch(`${projectUrl}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      apikey: serviceRole,
      Authorization: `Bearer ${serviceRole}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { name: u.name },
    }),
  })
  const data = await res.json()
  if (res.ok || data.msg?.includes('already')) {
    log(`  ✓ ${u.email}`)
  } else {
    log(`  ⚠ ${u.email}: ${JSON.stringify(data)}`)
  }
}

// ─── 6. write .env.local ─────────────────────────────────────────────────────

const envPath = '.env.local'
if (existsSync(envPath)) {
  log(`.env.local já existe — sobrescrevendo.`)
}
writeFileSync(envPath, [
  `VITE_SUPABASE_URL=${projectUrl}`,
  `VITE_SUPABASE_ANON_KEY=${anon}`,
  '',
].join('\n'))
log(`.env.local gerado!`)

// ─── done ─────────────────────────────────────────────────────────────────────

console.log(`
╔══════════════════════════════════════════════════════╗
║  Setup concluído!                                    ║
╠══════════════════════════════════════════════════════╣
║  .env.local gerado com URL e anon key                ║
║  Usuários demo criados                               ║
╠══════════════════════════════════════════════════════╣
║  Próximos passos:                                    ║
║  1. npm run dev  — testar login localmente           ║
║  2. Adicionar as vars no Netlify:                    ║
║     VITE_SUPABASE_URL=${projectUrl}
║     VITE_SUPABASE_ANON_KEY=<ver .env.local>          ║
║  3. Deletar este arquivo (setup-supabase.mjs)        ║
╚══════════════════════════════════════════════════════╝
`)
