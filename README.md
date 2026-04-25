# Analitico KLA — Analytics & Reforma Tributária

Portal de analytics empresarial com simulação de impactos da Reforma Tributária brasileira.
Desenvolvido por **Kliente 360**.

---

## Acesso

| Usuário | Senha |
|---------|-------|
| admin@kliente360.com | admin123 |
| demo@kliente360.com | demo@2025 |

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| UI | React 18 + TypeScript (strict) |
| Build | Vite 5 com code splitting por aba |
| Estilo | Tailwind CSS — identidade Kliente 360 (#009900) |
| Gráficos | Recharts 2 (Bar, Pie, Area, Line, Scatter, Treemap) |
| Estado | Zustand (auth) |
| Export | Papa Parse (CSV com BOM UTF-8) |
| Deploy | Netlify (branch `main`) |

---

## Funcionalidades Atuais

| Aba | O que faz |
|-----|-----------|
| **Dashboard** | KPIs globais, receita por setor, composição de impostos, variação % por setor, distribuição por porte |
| **Tabela Dinâmica** | Pivot table com linha/coluna/métrica configuráveis; vista card no mobile, tabela completa no desktop |
| **Simulação** | Sliders CBS / IBS-Bens / IBS-Serviços com impacto em tempo real por setor e empresa |
| **Por Setor** | Receita, atual vs reforma, composição stacked, scatter alíquota × receita, resumo por setor |
| **Regional** | Treemap por estado, impostos por região, carga por estado, tabela detalhada |
| **Tendências** | Projeção 2021–2033 com marcos da transição, comparativo 2025 vs 2033 por setor |
| **Dados Brutos** | Tabela completa com busca, filtros, colunas configuráveis, ordenação, exportação CSV |

---

## Arquitetura

```
src/
├── components/
│   ├── ChartTooltip.tsx   # Tooltip unificado para todos os gráficos
│   ├── ErrorBoundary.tsx  # Captura erros por aba sem derrubar o app
│   ├── KpiCard.tsx        # Card de KPI reutilizável
│   ├── Layout.tsx         # Header, navegação por abas, lazy loading
│   └── RangeSlider.tsx    # Slider de alíquota com label e valor
├── constants/
│   └── index.ts           # Cores, limiares, setores de serviço
├── data/
│   └── mockData.ts        # 35 empresas · 10 setores · 12 estados
├── hooks/
│   ├── usePivotTable.ts   # Lógica completa de pivot (agregar, totalizar)
│   └── useTableFilter.ts  # Filtro reutilizável (setor, estado, porte, busca)
├── pages/                 # 7 abas (lazy loaded individualmente)
├── store/
│   └── authStore.ts       # Zustand — login/logout em memória
├── types/
│   └── index.ts           # Company, TabId, DimensionKey, MetricKey
└── utils/
    └── formatters.ts      # fmtM, fmtPct, fmtNum, fmtVal
```

**Padrões adotados:**
- Cada aba é um chunk separado (lazy + Suspense) — carregamento sob demanda
- Dados em R$ mil como unidade base; `fmtM()` converte para exibição K/M/B
- `useTableFilter` aceita `FilterState` e é reutilizado em 4 páginas
- ErrorBoundary por aba — erro em uma aba não afeta as demais

---

## Dados Simulados

- **35 empresas** em 10 setores e 12 estados (SP, RJ, MG, RS, PR, SC, BA, CE, PE, GO, DF, AM)
- Alíquotas efetivas médias por setor para regime atual (IRPJ, CSLL, PIS, COFINS, ISS, ICMS)
- Reforma modelada conforme PEC 45/2019: CBS substitui PIS+COFINS; IBS substitui ICMS+ISS
- Cronograma de transição 2026–2033 com fases configuradas em `TRANSITION` no mockData
- Projeção de crescimento de 5% a.a. para dados de tendência

---

## Desenvolvimento

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # TypeScript + Vite — build de produção
```

---

## Análise de Qualidade — Estado Atual

### Pontos Fortes
- Arquitetura limpa com separação de responsabilidades (hooks, utils, constants, components)
- TypeScript strict sem erros de compilação
- Code splitting garante carregamento rápido da aba inicial (~12KB)
- Responsividade: mobile usa vista card na Tabela Dinâmica; grids adaptativos em todas as abas
- Recharts com `ResponsiveContainer` — gráficos se adaptam ao container

### Limitações Conhecidas
- **Autenticação em memória**: credenciais hardcoded no cliente, sem sessão persistente
- **Dados estáticos**: sem conexão a API ou banco de dados real
- **Sem testes**: ausência de testes unitários e de integração
- **Sem i18n**: apenas português; estrutura não preparada para múltiplos idiomas
- **Recharts bundle**: 587KB minificado (164KB gzip) — maior custo de performance

---

## Roadmap

### Fase 1 — Autenticação Real *(próxima sprint)*
- [ ] Substituir authStore por integração com Supabase Auth (ou Auth0)
- [ ] Sessão persistente via JWT / cookie seguro
- [ ] Controle de acesso por perfil (admin vs viewer)
- [ ] Tela de recuperação de senha

### Fase 2 — Dados Reais *(MVP com cliente)*
- [ ] Camada de serviço `src/services/` com abstração sobre fonte de dados
- [ ] Integração com API REST ou Supabase para carregar empresas
- [ ] Upload de arquivo CSV/Excel pelo usuário (substituir ou complementar dados)
- [ ] Cache de dados com SWR ou React Query
- [ ] Indicadores de carregamento por seção (skeleton loaders)

### Fase 3 — Funcionalidades Analíticas *(pós MVP)*
- [ ] Filtro de data / período (para dados históricos reais)
- [ ] Comparação entre dois cenários simultaneamente na Simulação
- [ ] Exportação PDF do dashboard (React PDF ou html2canvas)
- [ ] Favoritar/salvar configurações de pivot table por usuário
- [ ] Alertas configuráveis (ex.: "notificar se impacto > X%")

### Fase 4 — Performance e Qualidade *(paralelo ao Fase 3)*
- [ ] Testes unitários com Vitest (hooks, formatters, usePivotTable)
- [ ] Testes de componente com Testing Library
- [ ] Virtualização de tabelas longas (react-virtual) para >500 linhas
- [ ] Substituir Recharts por alternativa menor se bundle for crítico (e.g. Victory, Nivo)
- [ ] CI/CD: GitHub Actions com build + lint obrigatório para merge em main

### Fase 5 — Produto *(escala)*
- [ ] Multi-tenant: cada cliente vê apenas suas empresas
- [ ] Dashboard customizável (drag & drop de widgets)
- [ ] Notificações push para variações tributárias relevantes
- [ ] API pública para integração com ERPs (SAP, TOTVS, Omie)
- [ ] Modo de comparação entre empresas do mesmo setor (benchmarking)
