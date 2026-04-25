# Analitico KLA

> **Inteligência tributária em tempo real para a carteira de clientes do Kliente 360.**

O Analitico KLA transforma dados empresariais complexos em decisões claras. Com ele, consultores e gestores visualizam o impacto exato da Reforma Tributária sobre cada empresa da carteira — e simulam cenários alternativos em segundos, sem planilhas, sem código.

---

## O Problema que Resolve

A Reforma Tributária brasileira (PEC 45/2019) é a maior mudança fiscal em décadas. CBS substitui PIS e COFINS. IBS substitui ICMS e ISS. A transição vai de 2026 a 2033. Para cada empresa, o impacto é diferente — depende do setor, do estado, da composição de receita.

Gestores precisam de respostas rápidas:
- **Minha carteira vai pagar mais ou menos imposto?**
- **Quais setores são mais afetados?**
- **Se a alíquota do IBS for X%, qual o impacto empresa a empresa?**
- **O que muda se eu comparar dois cenários de reforma lado a lado?**

O Analitico KLA responde a todas essas perguntas com gráficos interativos, tabelas dinâmicas e simulações em tempo real.

---

## Para Quem Foi Feito

| Perfil | Como usa |
|--------|----------|
| **Consultor tributário** | Simula e compara cenários para apresentar ao cliente em reunião |
| **Gerente de carteira** | Identifica empresas com maior exposição à reforma |
| **Diretor financeiro** | Monitora impacto consolidado e projeta carga futura por setor |
| **Analista** | Explora dados brutos, cria visões dinâmicas e exporta para relatórios |

---

## Especificação Funcional — Alto Nível

### 1. Autenticação e Acesso

O portal é protegido por login com e-mail e senha. O sistema suporta múltiplos perfis de usuário. Na versão atual, as credenciais são gerenciadas localmente; a arquitetura está preparada para integração com provedores de identidade externos (Supabase Auth, Auth0) sem alteração nas páginas.

**Regras:**
- Sessão iniciada após validação de credenciais
- Logout encerra a sessão imediatamente
- Todas as abas analíticas exigem autenticação ativa

---

### 2. Dashboard Executivo

Visão consolidada da carteira com os principais indicadores em uma única tela.

**Indicadores (KPIs):**
- Total de empresas e setores representados
- Receita total da carteira (R$ M)
- Carga tributária total — regime atual
- Carga tributária total — pós-reforma
- Impacto médio percentual da reforma

**Gráficos:**
- Receita total por setor (barras horizontais, ordenado por valor)
- Composição de impostos atuais: ICMS, COFINS, IRPJ, ISS, CSLL, PIS (pizza com legenda)
- Comparativo atual vs pós-reforma por setor (barras agrupadas)
- Variação percentual por setor (barras com cor: verde = redução, vermelho = aumento)
- Distribuição da carteira por porte de empresa (pizza + cards de resumo)

**Exportação:** botão PDF/Imprimir disponível em todo o portal gera versão impressa limpa (controles e navegação ocultados automaticamente).

---

### 3. Tabela Dinâmica (Pivot Table)

Análise multidimensional configurável pelo próprio usuário, sem necessidade de suporte técnico.

**Dimensões disponíveis para linhas e colunas:**
- Setor de atividade
- Estado (UF)
- Região (Sudeste, Sul, Nordeste, Centro-Oeste, Norte)
- Porte (Pequena, Média, Grande)
- Década de fundação

**Métricas disponíveis:**
- Receita (R$ M)
- Funcionários
- Impostos atuais e pós-reforma (R$ M)
- Variação absoluta (R$) e percentual (%)
- Alíquota efetiva atual e pós-reforma
- Tributos individuais: IRPJ, CSLL, PIS, COFINS, ISS, ICMS, CBS, IBS

**Regras de agregação:**
- Métricas monetárias e de volume: **soma**
- Métricas de taxa (alíquota efetiva, variação %): **média ponderada**

**Ordenação:** por total (maior → menor ou menor → maior), configurável pelo usuário.

**Responsividade:** em telas menores que 768px, exibe lista ordenada simplificada (dimensão + total). Em desktop, exibe a tabela cruzada completa com totais por linha e coluna.

---

### 4. Simulação de Cenários

Motor de simulação que recalcula o impacto tributário em tempo real conforme o usuário ajusta as alíquotas da reforma.

**Variáveis controláveis:**
| Variável | Intervalo | Representa |
|----------|-----------|-----------|
| CBS | 0% – 15% | Contribuição sobre Bens e Serviços (substitui PIS + COFINS) |
| IBS — Bens | 0% – 30% | Imposto sobre Bens e Serviços para comércio e indústria (substitui ICMS) |
| IBS — Serviços | 0% – 20% | IBS para setor de serviços (substitui ISS) |

**Regras de cálculo:**
- IRPJ e CSLL: mantidos sem alteração (não são afetados pela reforma)
- Empresas de serviço (Tecnologia, Saúde, Financeiro, Construção, Serviços) usam alíquota IBS-Serviços
- Demais setores usam alíquota IBS-Bens

**Modo de comparação:**
- Ativado por botão "Comparar dois cenários"
- Exibe dois painéis de sliders independentes (Cenário A e Cenário B)
- Resumo com 4 indicadores: Atual | Reforma Oficial | Cenário A | Cenário B
- Gráfico com 4 barras por setor
- Tabela de impacto por empresa com colunas Δ A e Δ B lado a lado

**Filtro:** por setor de atividade (afeta apenas o cálculo consolidado; o gráfico por setor sempre mostra todos).

---

### 5. Análise por Setor

Visão detalhada de cada setor da economia presente na carteira.

**Filtros:** região geográfica e porte de empresa (combinados, com contagem de empresas ativas).

**Gráficos:**
- Receita por setor (barras horizontais com cor por setor)
- Atual vs pós-reforma por setor (barras agrupadas)
- Composição de impostos por setor — regime atual (barras empilhadas: ICMS, COFINS, ISS, IRPJ, CSLL, PIS)
- Dispersão receita × alíquota efetiva (scatter; tamanho do ponto proporcional ao número de funcionários)

**Tabela resumo por setor:** número de empresas, alíquota efetiva atual e impacto médio da reforma (badge colorido).

---

### 6. Análise Regional

Distribuição geográfica da carteira por estado e macrorregião.

**Filtros:** setor e porte.

**Gráficos:**
- Treemap de receita por estado (cor por região, tamanho proporcional à receita)
- Impostos por região — atual vs reforma (barras agrupadas com cor por região)
- Carga tributária por estado — regime atual (barras com cor por região)

**Tabela detalhada por estado:** região, número de empresas, receita total, impostos atuais, pós-reforma e impacto médio percentual.

---

### 7. Tendências e Projeções (2021–2033)

Evolução histórica e projeção da carga tributária ao longo do período de transição para o novo regime.

**Filtro:** por setor (afeta o gráfico de evolução; a tabela comparativa sempre mostra todos os setores).

**Visualização:** alternável entre gráfico de área (padrão) e gráfico de linha.

**Séries exibidas:**
- Regime Atual — projeção linear com crescimento de 5% a.a. (linha tracejada)
- Regime Reforma — projeção pós-reforma completa (linha tracejada)
- Transição Real — caminho efetivo considerando o calendário oficial da reforma (linha sólida)

**Marcos do calendário da reforma** (exibidos como cards e linhas de referência no gráfico):
- 2026: Início da transição — CBS vigente, IBS em teste (0,1%)
- 2027: CBS plena — extinção de PIS/COFINS, IBS a 20%
- 2029: IBS a 50% — ICMS/ISS reduzidos à metade
- 2033: Reforma completa — extinção total de ICMS/ISS

**Tabela comparativa 2025 → 2033:** impacto percentual e barra de tendência visual por setor.

---

### 8. Dados Brutos

Acesso completo à base de empresas com capacidade de exploração e exportação.

**Funcionalidades:**
- Busca por texto (nome, setor ou estado)
- Filtros por setor, estado e porte (combinados)
- Colunas configuráveis pelo usuário (mostrar/ocultar individualmente)
- Ordenação clicável em qualquer coluna (asc/desc com indicador visual)
- Exportação para CSV com BOM UTF-8 (compatível com Excel)

**Colunas disponíveis (22 no total):** Empresa, Setor, UF, Região, Porte, Fundação, Funcionários, Receita, IRPJ, CSLL, PIS, COFINS, ISS, ICMS, Total Atual, Alíq. Atual, CBS, IBS, Total Reforma, Alíq. Reforma, Δ R$, Δ%.

**Rodapé com totalizadores:** receita total, impostos atuais, impostos pós-reforma e total de funcionários do conjunto filtrado.

---

## Modelo de Dados — Conceitual

### Entidade: Empresa

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | string | Identificador único |
| name | string | Razão social |
| sector | string | Setor de atividade (10 categorias) |
| state | string | UF (2 letras) |
| region | string | Macrorregião (derivado do estado) |
| size | enum | Pequena / Média / Grande (por faixa de receita) |
| revenue | number | Receita anual em R$ mil |
| employees | number | Número de funcionários |
| founded | number | Ano de fundação |
| irpj, csll, pis, cofins, iss, icms | number | Tributos regime atual (R$ mil) |
| totalTaxCurrent | number | Carga total atual (R$ mil) |
| effectiveRateCurrent | number | Alíquota efetiva atual (%) |
| cbs, ibs | number | Tributos pós-reforma (R$ mil) |
| totalTaxReform | number | Carga total pós-reforma (R$ mil) |
| effectiveRateReform | number | Alíquota efetiva pós-reforma (%) |
| taxDelta | number | Variação absoluta (R$ mil) |
| taxDeltaPercent | number | Variação percentual (%) |

**Classificação por porte:** Pequena < R$ 30M · Média R$ 30M–R$ 300M · Grande > R$ 300M de receita anual.

---

## Arquitetura Técnica

```
src/
├── __tests__/          # 36 testes unitários (Vitest)
├── components/         # ChartTooltip, ErrorBoundary, KpiCard, Layout, RangeSlider
├── constants/          # Cores, limiares de porte, setores de serviço
├── data/               # mockData.ts — fonte de dados atual (substituível por API)
├── hooks/              # usePivotTable, useTableFilter
├── pages/              # 7 abas (lazy loaded individualmente)
├── store/              # authStore (Zustand)
├── types/              # Company, TabId, DimensionKey, MetricKey
└── utils/              # formatters.ts — fmtM, fmtPct, fmtNum, fmtVal
```

**Stack:** React 18 + TypeScript strict · Vite 5 com code splitting · Tailwind CSS · Recharts · Zustand · Papa Parse

**CI/CD:** GitHub Actions — build + typecheck + testes a cada push para `main`.

---

## Desenvolvimento Local

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # TypeScript + build de produção
npm test          # testes em modo watch
npm run test:run  # testes uma vez (usado no CI)
```

---

## Acesso

| Usuário | Senha |
|---------|-------|
| admin@kliente360.com | admin123 |
| demo@kliente360.com | demo@2025 |

---

*Desenvolvido por **Kliente 360** · Dados simulados para fins de demonstração*
