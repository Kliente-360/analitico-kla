<div align="center">

<img src="public/logo-kla.svg" width="80" alt="KLA Logo" />

# Analítico KLA

### Inteligência fiscal para a Reforma Tributária brasileira.

**Simule. Compare. Decida. — tudo em segundos, sem planilhas.**

[![Build](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)](#)
[![Coverage](https://img.shields.io/badge/coverage-≥69%25-brightgreen?style=flat-square)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](#)
[![License](https://img.shields.io/badge/licença-proprietária-red?style=flat-square)](#)

[**Acessar o Portal →**](https://analitico-kla.netlify.app) &nbsp;·&nbsp; [Reportar Bug](../../issues) &nbsp;·&nbsp; [Solicitar Feature](../../issues)

</div>

---

## Por que o Analítico KLA?

A **Reforma Tributária** (PEC 45/2019) é a maior mudança fiscal do Brasil em décadas. CBS substitui PIS + COFINS. IBS substitui ICMS + ISS. A transição vai de 2026 a 2033 — e cada empresa será impactada de forma diferente, dependendo do setor, do estado e da composição de receitas.

Consultores e gestores precisavam de uma ferramenta que respondesse, em tempo real:

> *"Minha carteira vai pagar mais ou menos imposto?"*  
> *"Quais clientes são mais vulneráveis à transição?"*  
> *"Se a alíquota do IBS cair de 26% para 22%, o que muda para cada empresa?"*

O **Analítico KLA** responde a tudo isso — com gráficos interativos, tabelas dinâmicas e simulações side-by-side — direto no browser, sem necessidade de planilhas, código ou suporte técnico.

---

## Funcionalidades

### Dashboard Executivo
Visão consolidada da carteira em uma tela. KPIs de receita, carga tributária atual e pós-reforma, impacto médio percentual. Seis widgets arrastáveis com ordem persistida por usuário.

### Tabela Dinâmica
Análise multidimensional configurável: 5 dimensões (setor, UF, região, porte, década) × 16 métricas (receita, impostos, alíquotas efetivas, variações). Soma automática vs. média ponderada por tipo de métrica.

### Simulador de Cenários
Sliders em tempo real para CBS, IBS-Bens e IBS-Serviços. Modo comparação A/B coloca dois cenários lado a lado — com gráfico e tabela de impacto por empresa. Nenhum reload, nenhuma espera.

### Análise por Setor
Receita por setor, composição de impostos, dispersão receita × alíquota efetiva, ranking de exposição à reforma. Filtros combinados por região e porte.

### Análise Regional
Treemap de receita por estado, impostos por macrorregião, tabela detalhada por UF com variação pós-reforma.

### Tendências 2021–2033
Projeção da transição real pelo calendário oficial da reforma — com marcos de 2026, 2027, 2029 e 2033 sinalizados no gráfico. Alternável entre área e linha.

### Power BI Analítico *(novo)*
8 sub-visões sobre dados fiscais nota a nota: carga efetiva CBS/IBS por ano, quadrante de créditos e débitos, pivot de produtos (entradas e saídas), DRE simulado, comparativo de preço e simulador fiscal com 10 variáveis ajustáveis.

### Dados Brutos
Tabela virtualizada de alta performance com busca, filtros, 22 colunas configuráveis e exportação CSV compatível com Excel (BOM UTF-8).

---

## Stack Técnica

| Camada | Tecnologia |
|--------|-----------|
| **UI** | React 18 + TypeScript strict + Vite 5 |
| **Estilos** | Tailwind CSS com sistema de design customizado |
| **Gráficos** | Recharts (Bar, Line, Area, Scatter, Composed) |
| **Estado** | Zustand |
| **Virtualização** | TanStack Virtual |
| **DnD** | dnd-kit |
| **Testes** | Vitest + Testing Library (≥ 177 testes, coverage ≥ 69%) |
| **Build/CI** | Vite 5 + pre-push hook (lint → build → coverage) |
| **Deploy** | Netlify (CD automático a cada push em `main`) |

### Arquitetura

```
src/
├── __tests__/        # Testes unitários e de integração (Vitest)
├── components/       # ChartTooltip, ErrorBoundary, KpiCard, Layout, RangeSlider
├── constants/        # Cores, limiares de porte, setores de serviço
├── data/
│   ├── mockData.ts   # Fonte de dados (substituível por API sem alterar as páginas)
│   └── powerbi/      # Star schema: fato_saidas, fato_entradas, fato_tributos + dims
├── hooks/            # usePivotTable, useTableFilter, usePageReady
├── pages/            # 8 abas analíticas (lazy loaded individualmente)
│   └── powerbi/      # 8 sub-páginas Power BI
├── store/            # authStore (Zustand)
├── types/            # Company, TabId, DimensionKey, MetricKey
└── utils/            # formatters.ts — fmtM, fmtPct, fmtNum, fmtVal
```

---

## Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento
npm run dev          # http://localhost:5173

# Testes
npm test             # modo watch
npx vitest run       # execução única

# Build de produção
npm run build        # TypeScript + Vite bundle
```

---

## Roadmap

| Fase | Foco | Status |
|------|------|--------|
| **1** | Auth + Dashboard + Tabela Dinâmica | ✅ Concluído |
| **2** | Simulador de Cenários + Análise Setorial/Regional | ✅ Concluído |
| **3** | Tendências + Dados Brutos + Export PDF | ✅ Concluído |
| **4A** | Power BI Analítico (8 visões fiscais nota a nota) | ✅ Concluído |
| **4B** | IPI modelado, calibração 26–28%, veredito automático | 🔄 Em planejamento |
| **5** | Upload CSV, dados reais via Supabase, export PDF Power BI | 📋 Backlog |

---

## Contexto de Domínio

O Analítico KLA é desenvolvido com base em premissas técnicas de especialistas tributários. Consulte [`docs/contexto-especialista.md`](docs/contexto-especialista.md) para as regras de negócio, alíquotas de referência, calendário da transição e diretrizes dos cenários de simulação.

---

<div align="center">

Desenvolvido por **[Kliente 360](https://kliente360.com.br)** · Dados simulados para fins de demonstração

</div>
