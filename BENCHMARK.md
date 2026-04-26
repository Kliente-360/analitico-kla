# BENCHMARK TÉCNICO E FUNCIONAL — Analitico KLA
**Versão:** 2.0 · **Data:** 2026-04-25 · **Revisão:** Pós-implementação Fases 1–3

> Documento de referência para análise contínua de qualidade. Atualizar a cada sprint relevante.

---

## METODOLOGIA DE SCORING

| Peso | Dimensão |
|------|----------|
| 20% | Código e Arquitetura |
| 20% | Funcionalidades |
| 15% | Testes e Qualidade |
| 15% | Performance |
| 15% | Segurança |
| 10% | UX e Responsividade |
| 5%  | Documentação |

Escala: **0–10** por subdimensão → média ponderada → score geral

🟢 ≥ 8.0 · 🟡 5.0–7.9 · 🔴 < 5.0

---

## SCORES POR DIMENSÃO

### 1. Código e Arquitetura — 9.2 / 10 🟢
*(anterior: 9.0)*

| Subdimensão | Score | Evidência |
|-------------|-------|-----------|
| TypeScript strict | 10/10 | `noUnusedLocals`, `noUnusedParameters`, zero `any`, zero `@ts-ignore` |
| Separação de responsabilidades | 9/10 | Components / Hooks / Pages / Store / Utils / Constants / Theme |
| Reutilização | 9/10 | `useTableFilter` em 4 páginas, `ChartTooltip` em 6 gráficos, `usePageReady` em 7 páginas |
| Lazy loading | 10/10 | 7 pages + ExportPdfButton lazy; vendor-pdf e vendor-virtual isolados |
| Code smells | 9/10 | `useCallback` em todos os handlers; setState-in-effect eliminado (SectorPage) |
| Acoplamento | 9/10 | `mockData.ts` é única fonte de verdade; páginas não dependem entre si |

**Total ponderado:** 9.2 / 10

---

### 2. Funcionalidades — 9.2 / 10 🟢
*(anterior: 8.7)*

| Módulo | Score | Destaques |
|--------|-------|-----------|
| Dashboard | 10/10 | 6 widgets drag-and-drop (dnd-kit), ordem persistida em localStorage |
| Tabela Dinâmica | 9/10 | 5 dimensões × 16 métricas, soma/média automática, mobile card view |
| Simulação de Cenários | 9/10 | 6 variáveis, recálculo em tempo real, modo comparação A vs B |
| Análise por Setor | 9/10 | 4 gráficos + scatter + PeerBenchmark (6 métricas vs média do setor) |
| Análise Regional | 8/10 | Treemap + barras por região + estado, 2 filtros combinados |
| Tendências 2021–2033 | 8/10 | 3 séries, marcos da reforma, alternância área/linha |
| Dados Brutos | 9/10 | Virtualização (@tanstack/react-virtual), 22 colunas, busca, sort, CSV |
| PDF Executivo | 9/10 | 4 páginas react-pdf (capa, KPIs, setores, top empresas) + window.print() |
| Notificações | 9/10 | Zustand store + browser Notification API + bell com badge de não-lidas |
| White-label | 9/10 | 4 temas predefinidos, CSS custom properties, persistência localStorage |

**Total ponderado:** 9.2 / 10

---

### 3. Testes e Qualidade — 8.5 / 10 🟢
*(anterior: 6.0)*

| Subdimensão | Score | Evidência |
|-------------|-------|-----------|
| Cobertura — utils | 10/10 | `formatters.ts` 100% (24 casos) |
| Cobertura — hooks | 10/10 | `usePivotTable` + `useTableFilter` 100% (22 casos) |
| Cobertura — pages | 8/10 | Testes de integração para todas as 7 páginas (Testing Library) |
| Cobertura — components | 8/10 | KpiCard, RangeSlider, ChartTooltip, ErrorBoundary testados |
| Cobertura — store | 8/10 | `authStore` (8 casos) + `themeStore` (6 casos) testados |
| Qualidade dos testes | 8/10 | AAA pattern, mocks de recharts/dnd-kit/react-virtual, edge cases |
| CI enforcement | 9/10 | ESLint + build + cobertura ≥50% branches (threshold enforced) + Lighthouse CI |

**93 testes · 10 arquivos · 100% passando**
**Cobertura: Statements 57% · Branches 50.4% · Functions 51% · Lines 59%**

**Total ponderado:** 8.5 / 10

---

### 4. Performance — 8.5 / 10 🟢
*(anterior: 7.7)*

| Subdimensão | Score | Evidência |
|-------------|-------|-----------|
| Initial load | 9/10 | Entry chunk 19KB — primeira aba carrega sem Recharts nem PDF |
| Code splitting | 10/10 | 9 chunks de página + vendor-pdf (lazy) + vendor-virtual isolados |
| Skeleton loaders | 9/10 | `usePageReady` + `requestAnimationFrame` em todas as 7 páginas |
| Memoização | 9/10 | `useMemo` em cálculos pesados + `useCallback` em todos os handlers |
| Virtualização | 9/10 | `@tanstack/react-virtual` na RawDataPage (scrolling infinito) |
| Bundle gzip (sem PDF) | 8/10 | ~215KB gzip total sem vendor-pdf (carregado sob demanda) |
| Web Vitals | 5/10 | Lighthouse CI configurado; sem medição real ainda |

| Chunk | Min. | Gzip |
|-------|------|------|
| vendor-pdf *(lazy)* | 1.460 KB | 491 KB |
| vendor-recharts | 587 KB | 165 KB |
| vendor-virtual | 60 KB | 19 KB |
| vendor-misc | 45 KB | 14 KB |
| index (entry) | 19 KB | 6 KB |
| Pages (7×) | 7–12 KB | 2–3 KB |
| CSS | 25 KB | 5 KB |
| **TOTAL (sem PDF)** | **~780 KB** | **~215 KB** |

**Total ponderado:** 8.5 / 10

---

### 5. Segurança — 5.3 / 10 🟡
*(sem alteração — auth adiado intencionalmente)*

| Subdimensão | Score | Evidência |
|-------------|-------|-----------|
| Autenticação | 2/10 | 🚨 Credenciais hardcoded em `authStore.ts`, visíveis no bundle |
| XSS | 9/10 | React escapa output; sem `dangerouslySetInnerHTML` |
| Injeção | 9/10 | Dados locais; sem SQL; Papa Parse com proteção integrada |
| Exposição de dados | 8/10 | Dados simulados, nenhuma API call, nenhum token exposto |
| CSP / Headers | 4/10 | Não configurado |
| Dependências | 7/10 | npm audit limpo |
| Sessão | 3/10 | Estado em memória; perdido no refresh; sem expiração |

**Risco crítico:** `authStore.ts` expõe `admin123` no bundle. Inaceitável com dados reais de clientes.

**Total ponderado:** 5.3 / 10

---

### 6. UX e Responsividade — 8.0 / 10 🟢
*(anterior: 6.5)*

| Subdimensão | Score | Evidência |
|-------------|-------|-----------|
| Mobile — layout | 7/10 | Grids adaptativos, flex-wrap em filtros |
| Mobile — pivot table | 9/10 | Vista card resumida em `< md`, tabela completa em `≥ md` |
| Print / PDF | 9/10 | `window.print()` + react-pdf 4 páginas; controles ocultos automaticamente |
| Acessibilidade ARIA | 7/10 | `aria-label`, `aria-current`, `role="alert"`, `htmlFor`/`id` implementados |
| Focus management | 4/10 | Sem focus trap, sem skip-to-content |
| Contraste de cores | 8/10 | Paleta atende WCAG AA visualmente |
| Skeleton loaders | 9/10 | `animate-pulse` em todas as páginas durante carregamento |
| Dashboard drag-and-drop | 9/10 | dnd-kit com sensor de 8px, persistência localStorage |
| Notificações | 8/10 | Bell com badge, browser Notification API, mark-all-read |
| White-label theming | 9/10 | 4 temas, troca em tempo real, salvo automaticamente |

**Total ponderado:** 8.0 / 10

---

### 7. Documentação — 8.5 / 10 🟢
*(sem alteração)*

| Subdimensão | Score | Evidência |
|-------------|-------|-----------|
| README de produto | 9/10 | Problema, personas, funcionalidades, modelo de dados |
| Especificação funcional | 9/10 | 8 módulos com regras de negócio, variáveis, gráficos |
| Arquitetura | 8/10 | Estrutura de diretórios, stack, CI/CD documentados |
| CLAUDE.md | 9/10 | Regras de desenvolvimento, prevenção de timeout, branch policy |
| Comentários inline | 6/10 | Mínimos e apropriados |
| Changelog / ADRs | 2/10 | Sem CHANGELOG.md, sem ADRs |

**Total ponderado:** 8.5 / 10

---

## SCORE GERAL

| Dimensão | Peso | v1.0 | v2.0 | Δ | Contribuição |
|----------|------|------|------|---|-------------|
| Código e Arquitetura | 20% | 9.0 | **9.2** | +0.2 | 1.84 |
| Funcionalidades | 20% | 8.7 | **9.2** | +0.5 | 1.84 |
| Testes e Qualidade | 15% | 6.0 | **8.5** | +2.5 | 1.28 |
| Performance | 15% | 7.7 | **8.5** | +0.8 | 1.28 |
| Segurança | 15% | 5.3 | **5.3** | — | 0.80 |
| UX e Responsividade | 10% | 6.5 | **8.0** | +1.5 | 0.80 |
| Documentação | 5% | 8.5 | **8.5** | — | 0.43 |
| **TOTAL** | **100%** | **7.5** | **8.3 / 10** 🟢 | **+0.8** | |

> **Interpretação:** O projeto saltou de 7.5 para **8.3** — território 🟢 — após implementação das Fases 1–3 do roadmap. O único vetor que ainda puxa o score para baixo é **Segurança (5.3)**, exclusivamente por causa da autenticação hardcoded. Com dados reais e auth via Supabase, o score atinge **~9.0**.

---

## BENCHMARK COMPETITIVO

| Critério | Analitico KLA | Power BI | Looker Studio | Metabase | Tableau |
|----------|:---:|:---:|:---:|:---:|:---:|
| **Simulação de alíquotas CBS/IBS em tempo real** | 🟢 10 | 🔴 2 | 🔴 2 | 🔴 2 | 🔴 2 |
| **Comparação de cenários A vs B** | 🟢 9 | 🟡 6 | 🔴 3 | 🟡 5 | 🟡 6 |
| **Dashboard customizável (drag-and-drop)** | 🟢 9 | 🟢 9 | 🟡 6 | 🟡 6 | 🟢 9 |
| **Pivot table configurável sem código** | 🟢 9 | 🟢 10 | 🟡 6 | 🟢 9 | 🟢 10 |
| **Projeção temporal com calendário da reforma** | 🟢 9 | 🟡 5 | 🟡 5 | 🟡 5 | 🟡 5 |
| **Benchmarking entre pares do setor** | 🟢 9 | 🟡 6 | 🔴 3 | 🟡 5 | 🟡 6 |
| **Exportação CSV** | 🟢 9 | 🟢 9 | 🟢 9 | 🟢 9 | 🟢 9 |
| **Exportação PDF executivo** | 🟢 9 | 🟢 9 | 🟢 8 | 🟡 6 | 🟢 9 |
| **White-label / personalização de marca** | 🟢 9 | 🟡 6 | 🟡 5 | 🟡 6 | 🟡 6 |
| **Custo de implantação** | 🟢 10 | 🟡 5 | 🟢 8 | 🟡 6 | 🔴 2 |
| **Tempo para insights (onboarding)** | 🟢 9 | 🟡 5 | 🟡 7 | 🟡 6 | 🔴 3 |
| **Integração com dados reais** | 🔴 2 | 🟢 10 | 🟢 10 | 🟢 9 | 🟢 10 |
| **Autenticação enterprise** | 🔴 2 | 🟢 9 | 🟢 9 | 🟢 8 | 🟢 9 |
| **Colaboração multi-usuário** | 🔴 1 | 🟢 9 | 🟢 9 | 🟢 8 | 🟢 9 |
| **MÉDIA GERAL** | **7.6** | **7.1** | **6.9** | **6.7** | **6.8** |

> **Conclusão:** O Analitico KLA **lidera** no contexto específico da Reforma Tributária Brasileira. As desvantagens são apenas em integração de dados reais e auth enterprise — itens intencionalmente adiados.

---

## ANÁLISE DE GAPS ATUAL

| # | Gap | Impacto no Score | Complexidade | Prioridade |
|---|-----|-----------------|-------------|------------|
| 1 | Credenciais hardcoded em `authStore.ts` | +1.5 pts (Segurança) | Média | 🔴 Crítica |
| 2 | Integração com dados reais (Supabase) | +0.8 pts (Funcional) | Alta | 🔴 Estratégica |
| 3 | Cobertura de testes < 60% statements | +0.3 pts (Testes) | Média | 🟡 Média |
| 4 | Focus management / skip-to-content | +0.2 pts (UX) | Baixa | 🟡 Baixa |
| 5 | CSP / Security headers | +0.1 pts (Segurança) | Baixa | 🟡 Baixa |
| 6 | Web Vitals medidos (Lighthouse real) | +0.1 pts (Performance) | Baixa | 🟡 Baixa |
| 7 | CHANGELOG.md + ADRs | +0.1 pts (Docs) | Baixa | 🟢 Futura |
| 8 | Multi-tenant (carteiras isoladas por cliente) | Estratégico | Alta | 🔴 Estratégica |

---

## ROADMAP

### ✅ Concluído — Fases 1, 2 e 3

| Feature | Score impactado |
|---------|----------------|
| Arquitetura com hooks/utils/constants/theme centralizados | Código +2.0 |
| Code splitting: 9 chunks + vendor-pdf/virtual isolados | Performance +1.5 |
| `useCallback` em todos os handlers de filtro | Performance +0.5 |
| Virtualização de tabelas (`@tanstack/react-virtual`) | Performance +0.8 |
| Skeleton loaders em todas as 7 páginas (`usePageReady`) | UX +0.8 |
| Dashboard drag-and-drop (dnd-kit + localStorage) | UX +1.0 / Funcional +0.5 |
| PDF executivo 4 páginas (`@react-pdf/renderer`) | Funcional +0.5 |
| Notificações push (Zustand + browser Notification API) | Funcional +0.3 |
| White-label com 4 temas e CSS custom properties | Funcional +0.3 |
| PeerBenchmark — empresa vs média do setor | Funcional +0.5 |
| ESLint v9 flat config + Prettier no CI | Testes +0.5 |
| 93 testes: components, stores, integração de 7 páginas | Testes +2.5 |
| Coverage threshold ≥50% branches enforced no CI | Testes +0.3 |
| Lighthouse CI workflow configurado | Performance +0.2 |
| ARIA labels, `aria-current`, `role="alert"`, `htmlFor` | UX +0.5 |
| CLAUDE.md com regras de desenvolvimento | Docs +0.3 |

---

### 🔴 Fase 4 — Dados Reais + Auth *(próxima sprint estratégica)*

**Objetivo:** score 8.3 → 9.0+ · produto pronto para clientes reais

| Tarefa | Impacto | Esforço |
|--------|---------|---------|
| Supabase Auth (JWT + sessão persistente + refresh token) | Segurança +1.5 | Alto |
| Camada `src/services/` abstraindo fonte de dados | Arquitetura | Médio |
| Integração Supabase (PostgreSQL) — carregar carteira real | Funcional +0.8 | Alto |
| Upload CSV/Excel pelo usuário (importar carteira) | Funcional +0.5 | Médio |
| React Query — cache, loading states, retry | Performance +0.3 | Médio |
| Row-level security (cada cliente vê só seus dados) | Segurança +0.5 | Alto |
| CSP headers (Netlify `_headers` ou Supabase Edge) | Segurança +0.3 | Baixo |

---

### 🟡 Fase 5 — Escala e Produto *(trimestre 3–4)*

**Objetivo:** score 9.0 → 9.5+ · plataforma multi-cliente

| Tarefa | Impacto |
|--------|---------|
| Multi-tenant: carteiras isoladas por cliente/tenant | Estratégico |
| Integração ERP (TOTVS, SAP, Omie) via webhook/API | Estratégico |
| Alertas automáticos de variação tributária relevante | Funcional +0.3 |
| Testes E2E com Playwright (golden paths) | Testes +0.5 |
| Cobertura de testes ≥ 80% statements | Testes +0.4 |
| WCAG AA auditoria completa (axe-core) | UX +0.3 |
| CHANGELOG.md + ADRs | Docs +0.3 |
| Internacionalização (i18n) — inglês e espanhol | Estratégico |

---

## PROJEÇÃO DE SCORE

| Estado | Score | Quando |
|--------|-------|--------|
| v1.0 — linha de base | 7.5 🟡 | Abril 2026 |
| **v2.0 — atual** | **8.3 🟢** | **Abril 2026** |
| Pós Fase 4 (dados reais + auth) | **~9.0 🟢** | Mai–Jul 2026 |
| Pós Fase 5 (escala + produto) | **~9.5 🟢** | Q3–Q4 2026 |

---

## MÉTRICAS DE REFERÊNCIA

```
Testes (atual):
  Total de testes:          93   → meta Fase 5: 150+
  Arquivos de teste:        10   → meta Fase 5: 15+
  Coverage statements:     57%  → meta Fase 5: 80%+
  Coverage branches:      50.4% → meta Fase 5: 70%+

Build (atual):
  TypeScript errors:         0  ✅
  ESLint errors:             0  ✅
  ESLint warnings:           8  → meta: 0
  Bundle gzip (sem PDF):  ~215KB → meta: manter < 250KB

Segurança (atual):
  Credenciais hardcoded:   SIM  🚨 → meta Fase 4: NÃO
  Auth JWT:                NÃO  → meta Fase 4: SIM
  CSP header:              NÃO  → meta Fase 4: SIM

Acessibilidade (atual):
  ARIA implementado:  parcial   → meta Fase 5: WCAG AA completo
  Focus management:    básico   → meta Fase 5: completo
```

---

*Documento atualizado automaticamente via análise estática do repositório.*
*Versão 2.0 — Abril 2026. Próxima revisão: após conclusão da Fase 4.*
