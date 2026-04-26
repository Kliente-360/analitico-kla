# Handoff: Analítico KLA — Redesign Frontend

**Para:** Time de desenvolvimento (via Claude Code)
**Repositório alvo:** [github.com/Kliente-360/analitico-kla](https://github.com/Kliente-360/analitico-kla)
**Deploy atual:** [kliente360-analitico-kla.netlify.app](https://kliente360-analitico-kla.netlify.app/)
**Stack alvo:** React 18 + TypeScript + Vite + Tailwind + Recharts + Zustand (já existente)

---

## 0. Status de implementação (2026-04-25)

| Sprint | Escopo | Status |
|---|---|---|
| 1 — Foundation | Tokens, Sidebar, Topbar, KpiCard, dark mode store | ✅ Concluído |
| 2 — Core analytics | Dashboard hero narrativo, Pivot heatmap, Cenários A/B | ✅ Concluído |
| 3 — Resto | Login redesign, Setor, Regional (treemap), Tendências, Dados Brutos | ✅ Concluído |
| 4 — Polish | Responsividade, estados loading/erro, animações, testes | 🟡 Parcial (testes + lint OK; animações e empty states pendentes) |

### Desvios deliberados em relação ao spec original

- **Brand primária:** **vermelho institucional `#e30613`** (era `#0b3d8c` azul no spec original). Wireframes nesta pasta já refletem a paleta nova (`tokens.css`, `app.jsx`, `dashboard.jsx`, `extra-pages.jsx`, `mobile.jsx` atualizados).
- **Hero do Dashboard:** usa `--kla-ink` (carvão) com texto branco, não gradiente vermelho — alinhado à regra "vermelho com parcimônia". Hero do Login: painel sólido `bg-primary-700` (não gradiente azul).
- **Login:** título atual é _"Bem-vindo de volta"_ (não _"Entrar no portal"_). Inclui chips de features (CBS/IBS, Filiais & UFs, Cenários A/B). **Sem botão SSO Salesforce** nesta fase.
- **Sidebar:** rótulos finais são `Setor` / `Regional` / `Tendências` (em vez de `Por Linha de Negócio` / `Por Filial / UF`) — termos curtos para o nav. Conteúdo das telas mantém a premissa single-tenant.
- **Constantes legadas:** `CHART_COLORS` e `BUSINESS_LINE_COLORS` em `src/constants.ts` ainda contêm tons azuis — refatorar para a paleta vermelho/neutros em sprint de polish.

---

## 1. Sobre estes arquivos

Os arquivos HTML/JSX deste pacote são **referências de design** — protótipos visuais
construídos em React inline com Babel para mostrar a aparência e comportamento desejados.

**A tarefa não é copiar este código.** É **recriar estas telas no codebase real**
(`Kliente-360/analitico-kla`), que já tem React 18 + TypeScript + Tailwind + Recharts +
Zustand configurados. Use os padrões e bibliotecas já estabelecidos lá.

**Fidelidade:** Wireframes médios. Estrutura, hierarquia, tipografia e cores da marca
estão definidas. A composição visual é fiel ao desejado, mas pequenos ajustes finos
(densidade, raios, sombras) podem ser tomados pelo desenvolvedor seguindo os tokens.

---

## 2. Premissa que reorienta o produto

> O README atual descreve o produto como ferramenta de **carteira de clientes** para
> consultores. **Isso muda.** O produto agora é **single-tenant**: uma empresa por
> sessão analisa **seus próprios dados** sob a Reforma Tributária.

Implicações práticas:

- "Empresa" no topbar é a **própria empresa logada**, não um seletor de carteira.
- Em todas as telas, o **protagonista visual** é a empresa logada — seu CNPJ, suas
  filiais, seus tributos.
- Storytelling em primeira pessoa: "**A Bodytech** vai pagar **R$ 4,2 M** a menos…"
  em vez de gráficos genéricos de carteira.
- "Setor" → **"Linha de Negócio"** (vertical interna da empresa).
- "Regional" → **"Por Filial / UF"** (filiais próprias, não estados de clientes
  diferentes).

---

## 3. Direção visual

### 3.1 Cores (CSS variables)

**Filosofia:** vermelho institucional do cliente (`#E30613`) é cor primária de marca,
mas usado com **parcimônia** — nunca como preenchimento de cards grandes (é agressivo
aos olhos em áreas grandes). Vermelho aparece em: ações primárias (botões, links),
barras laterais de ênfase (3-4px), ícones, números-chave, títulos curtos, segmento
principal de gráficos. Para áreas grandes (hero do login, cabeçalhos, fundos
de seção) usa-se **carvão institucional** (`--kla-ink`).

```css
/* Brand — vermelho cliente */
--kla-primary:       #e30613;   /* primário (ações, ênfase) */
--kla-primary-700:   #a8040e;   /* hover/active */
--kla-primary-600:   #c4040f;
--kla-primary-500:   #e30613;
--kla-primary-400:   #ed4a52;   /* gráfico secundário */
--kla-primary-300:   #f48a8f;
--kla-primary-200:   #fac4c7;
--kla-primary-100:   #fde9eb;   /* tint de hover/seleção (uso pontual) */
--kla-primary-50:    #fef4f5;

/* Carvão institucional — fundos grandes de marca */
--kla-ink:           #1a1d24;   /* hero login, cabeçalhos brand */
--kla-ink-700:       #2c3038;
--kla-ink-500:       #4a4f5a;

/* Semântica de variação tributária — separada da brand */
--kla-accent-up:     #c0392b;   /* aumento de carga (ruim) — terroso pra não brigar com brand */
--kla-accent-down:   #1f7a5a;   /* redução de carga (bom) */
--kla-accent-warn:   #b87514;   /* alerta */

/* Neutros levemente quentes */
--ink-900: #14171c;
--ink-700: #2f343d;
--ink-500: #5a6068;
--ink-400: #828892;
--ink-300: #b6bac2;
--ink-200: #dadde2;
--ink-100: #ecedf0;
--ink-50:  #f7f7f8;
--paper:   #ffffff;
```

Ver arquivo completo + tema dark em `styles/tokens.css`.

**Regras de uso do vermelho:**
- ✅ Botões primários, links, badges de ação, eyebrows curtos, ícones
- ✅ Barras laterais de ênfase (3-4px) em cards hero
- ✅ Maior segmento de gráficos (não todos os segmentos)
- ✅ Números-chave com peso 600+
- ❌ Fundos grandes de cards ou hero — use `--paper` ou `--kla-ink`
- ❌ Multi-séries em gráficos — use neutros + 1 vermelho
- ❌ Cabeçalhos inteiros pintados — use carvão

**Tweaks runtime:** cor primária e modo claro/escuro são controláveis pelo usuário.
A implementação real deve expor isso como configuração de workspace ou preferência
de usuário, persistido em `localStorage` ou no backend.

### 3.2 Tipografia

| Uso | Família | Pesos | Notas |
|---|---|---|---|
| UI geral | **Inter** (Google Fonts) | 400, 500, 600, 700 | sans-serif neutro |
| Números executivos / títulos hero | **Fraunces** (Google Fonts) | 600, 700 | serif moderno, `letter-spacing: -0.02em` |
| Eyebrows / labels técnicos | **JetBrains Mono** | 400, 500 | monospaced para números, taxas, códigos |
| (apenas no wireframe — remover em hi-fi) | Caveat | — | rascunho |

Tabular numerals em todos os números: `font-feature-settings: "tnum"`.

### 3.3 Espaçamento e raios

- Grid: 4px base (4, 8, 12, 16, 20, 24, 32, 40, 60).
- Raios: `4px` (chips/badges), `6px` (inputs/buttons), `8-12px` (cards).
- Sombras: `0 1px 2px rgba(15,23,34,.05)` (sm), `0 4px 14px rgba(15,23,34,.08)` (md).

### 3.4 Cor + significado

- **Variação tributária negativa (redução de carga = bom):** verde `--kla-accent-down`.
- **Variação tributária positiva (aumento = ruim):** terroso `--kla-accent-up` (não usar `--kla-primary` para isso, evita conflito de leitura).
- **Reforma:** sempre vermelho `--kla-primary`. **Atual:** sempre cinza `--ink-500`.
- **Cenário A** em comparações A/B: `#0a8f6e`. **Cenário B:** `#c9532f`.

---

## 4. Shell global (componente Layout)

Substitui o atual `Layout.tsx`. Aplica-se a todas as telas autenticadas.

### 4.1 Sidebar (224px fixa, colapsável para 56px)

- Logo Kliente 360 + sub-rótulo "Analítico KLA" no topo.
- Group label "Análise" em micro-caps `--ink-500`.
- 7 itens nav, cada um com ícone (16px, stroke 1.5) + label:
  1. Visão Executiva (`/`)
  2. Análise Multidimensional (`/pivot`)
  3. Simulação de Cenários (`/simulacao`) — **badge "novo"** âmbar
  4. Por Linha de Negócio (`/setor`)
  5. Por Filial / UF (`/regional`)
  6. Tendência 2026–2033 (`/tendencias`)
  7. Dados Brutos (`/dados`)
- Item ativo: fundo `--kla-primary-100`, texto `--kla-primary-600`, peso 600,
  barra vertical 3px à esquerda em `--kla-primary`.
- Bloco "Dúvidas tributárias?" no rodapé com CTA para contato com consultor.

### 4.2 Topbar (56px)

- **Empresa logada** à esquerda: avatar 32x32 com iniciais sobre `--kla-primary`,
  nome em peso 600, subtítulo `CNPJ XX.XXX.XXX/XXXX-XX · Dados Jan–Dez 2025`,
  caret pequeno (sem trocar empresa — apenas info, nas próximas iterações pode virar
  troca de período/filial).
- Pill seletor de período: "Período: **Ano fiscal 2025**".
- Busca global ⌘K (placeholder "Buscar tributo, filial, NCM…", largura 220px).
- Sininho de notificações com dot vermelho.
- Botão primário **"Exportar relatório"** (azul, com ícone download).
- Avatar do usuário 32x32 redondo.

Referência: `components/shell.jsx`.

---

## 5. Telas

### Tela 00 · Login (`/login`)

**Propósito:** porta de entrada antes de qualquer rota autenticada.

**Layout:** grid `1fr 1.1fr` em desktop. Mobile: form em cima, brand colapsa em hero.

**Painel esquerdo (brand):**
- Background `linear-gradient(160deg, #0b3d8c 0%, #0a3275 100%)`, texto branco.
- Logo no topo.
- Hero central: eyebrow "Inteligência tributária" + H1 (Fraunces 44px,
  `letter-spacing: -0.02em`, line-height 1.05): _"Veja o impacto da Reforma sobre a
  sua operação — em segundos."_
- Parágrafo de apoio (14px, opacity 0.85).
- Footer copyright + contato.
- Decoração: círculos concêntricos SVG opacity 0.08 no canto inferior direito.

**Painel direito (form):**
- 380px de largura.
- Title (Fraunces 28px) "Entrar no portal" + subtítulo cinza.
- Inputs: e-mail corporativo, senha (com botão "mostrar"), checkbox "Lembrar deste
  dispositivo", link "Esqueci a senha", botão primário "Entrar".
- Divider "ou".
- Botão secundário "Continuar com Salesforce SSO".
- Link "Solicite acesso" no rodapé.

**Estados:** loading no botão "Entrar" (spinner branco), erro inline abaixo do
campo, validação de e-mail antes de submeter.

**Observação:** o backend já suporta auth local. Manter `authStore` (Zustand)
existente, apenas re-skinning visual.

---

### Tela 01 · Visão Executiva (`/`)

**Propósito:** primeira tela após login. O gestor entende o impacto da reforma em 3 segundos.

**Estrutura (grid 12 colunas, gap 12px):**

#### Hero `colSpan: 12`
- Card com gradiente vertical `--kla-primary-100 → --paper`, borda 1.5px primária.
- Layout interno: grid `1.2fr 1fr`.
- Esquerda: eyebrow "Impacto consolidado · Reforma Tributária" (em `--kla-primary`),
  H1 (Fraunces 32px) **personalizado com nome da empresa**:
  _"A {empresa} vai pagar **R$ 4,2 M a menos** de imposto no regime pós-reforma"_
  (o número em `--kla-accent-down`).
- Parágrafo explicativo (13px, `--ink-500`) com alíquotas oficiais usadas.
- 2 botões: primário "Simular outro cenário →", secundário "Ver memorial de cálculo".
- Direita: 2 barras comparativas grandes (Atual `--ink-500` vs Pós-reforma `--kla-primary`),
  com valores em Fraunces. Tag de variação `−10,8% · economia estimada` em verde.

#### Strip de KPIs `colSpan: 2 cada`
5 cards KpiCard:
1. Receita anual 2025 — R$ 312 M, delta +8,4% vs 2024
2. Carga atual — 12,4% (alíquota efetiva)
3. Carga pós-reforma — 11,1%, delta −1,3 p.p.
4. Filiais analisadas — 13 ativas, 6 UFs
5. Período pleno — 2033, delta −10,8% vs 2025

E 1 alert card `colSpan: 4` (fundo `#fff8e6`, borda âmbar):
- Ícone `!` em quadrado âmbar, título "Atenção · Filial DF" + corpo + CTA.

#### Charts row 1
- **`colSpan: 5`** — Composição de impostos (donut + legenda lateral 2 colunas).
  6 segmentos: ICMS, COFINS, PIS, IRPJ, CSLL, ISS, em tons de azul + cinza.
  Centro do donut: total atual em Fraunces.
- **`colSpan: 7`** — Carga por filial atual vs reforma. Barras horizontais empilhadas:
  cinza (atual) em cima, azul (reforma) embaixo, com Δ% à direita colorido.

#### Timeline `colSpan: 12`
- Projeção 2025 → 2033, R$ Milhões.
- 2 séries: linha tracejada cinza (sem reforma) + área azul preenchida (com reforma).
- Marker vertical âmbar tracejado no ano 2027 (CBS plena).
- Legenda inline no canto superior direito.

**Recharts:** usar `LineChart`, `BarChart`, `PieChart`, `AreaChart`.

---

### Tela 02 · Análise Multidimensional (`/pivot`)

**Propósito:** cruzar qualquer dimensão dos dados (filial × tributo, mês × UF, etc).

**Header:** breadcrumb + título Fraunces + sub.

**Controls bar:** card horizontal com 4 grupos separados por divisor vertical:
- Linhas (chips: Filial active, +)
- Colunas (chips: Tributo active, +)
- Métrica (chips: Valor (R$) active)
- Regime (segmented control: Atual / Reforma / Δ)
- À direita: "Salvar visão" (secondary) + "CSV" (secondary com ícone).

**Insight strip** (3 cards `1fr 1fr 1fr`):
- "Maior contribuinte" — SP — Pinheiros · R$ 9,8 M · 25%
- "Tributo dominante" — ICMS · R$ 13,9 M · 38%
- "Anomalia detectada" — DF — Asa Sul (texto âmbar) · ISS responde por 50%

**Pivot table:**
- Linhas = filiais, colunas = tributos.
- Cells de heatmap: `rgba(11,61,140, 0.05 + intensity*0.35)` proporcional ao valor.
- Coluna "Total" destacada em `--kla-primary-100`, números bold em `--kla-primary`.
- Row "Total" no rodapé em `--ink-50` bold, célula final do total sobre fundo
  `--kla-primary` com texto branco.

**Footer:** "13 filiais · 7 tributos · agregação por soma · valores em R$ M" +
timestamp atualizado em mono.

**Lib sugerida:** estender o hook `usePivotTable` existente. Heatmap pode ser
inline-styled (não precisa de lib).

---

### Tela 03 · Simulação de Cenários (`/simulacao`)

**Propósito:** ajustar CBS/IBS e ver impacto em tempo real. Compara A vs B.

**Header:** título "E se a alíquota fosse outra?" + chips de ação:
"↻ Resetar tudo" / "Comparar A vs B" (active) / "Salvar cenário".

**Resumo comparativo** (card grande):
- Título "Resumo comparativo" + post-it sketchy com delta highlight.
- 4 barras lado a lado com label embaixo: Atual (cinza), Reforma oficial (azul),
  Cenário A (`#0a8f6e`), Cenário B (`#c9532f`). Valor em mono no topo de cada barra.

**Dois cenários lado a lado** (grid `1fr 1fr`):
Cada `ScenarioCard`:
- Header: tag colorida com fundo da cor do cenário (CENÁRIO A, CENÁRIO B) + título
  + botão "resetar".
- 3 sliders verticais: CBS (0–15%), IBS — Bens (0–30%), IBS — Serviços (0–20%).
  Track gray, fill na cor do cenário, thumb 16px branco com borda da cor.
- Divider.
- "Carga total simulada" — número grande Fraunces 28px + delta colorido vs atual.

**Tabela impacto por filial:**
6 colunas: Filial, Atual, Cenário A, Δ A, Cenário B, Δ B. Headers das colunas A/B
nas cores dos cenários. Δ% colorido (verde/vermelho) bold.

**Regras de cálculo (manter as do README):**
- IRPJ e CSLL não mudam.
- Empresas/filiais de serviço (Tecnologia, Saúde, Financeiro, Construção,
  Serviços) usam IBS-Serviços. Demais usam IBS-Bens.

**Reatividade:** sliders devem recalcular **em tempo real**, não em submit.
Use `useMemo` sobre os valores dos sliders.

---

### Tela 04 · Por Linha de Negócio (`/setor`)

**Propósito:** análise por vertical interna da empresa.

**Filtros (chips):** "Todas as filiais" (active), "Apenas SP", "Apenas Sudeste".
Direita: "↕ ordenar por receita".

**Layout (grid `1.4fr 1fr`):**

- **Esquerda — Carga por linha de negócio.** Para cada linha, 2 micro-bars
  empilhadas (atual cinza, reforma azul) com label e Δ% à direita. Grid interno
  `60px 1fr 60px`.
- **Direita — Scatter receita × alíquota efetiva.** Bolhas onde tamanho = nº de
  filiais, cor = identidade da linha. Eixos com labels mono.

**Tabela** com 6 colunas: Linha, Filiais, Receita, Alíq. atual, Alíq. reforma, Δ%
(badge colorido pill).

---

### Tela 05 · Por Filial / UF (`/regional`)

**Propósito:** distribuição geográfica das **filiais próprias**.

**Layout (grid `1fr 1fr`):**

- **Esquerda — Treemap das UFs.** Grid CSS `50% 25% 25%` × `60% 40%`.
  SP ocupa célula gigante esquerda (gridRow span 2). Cor: azul para redução,
  laranja `#c9532f` para aumento. Cada tile tem UF gigante (Fraunces),
  receita + Δ% no rodapé.
- **Direita — Carga tributária por UF.** Lista vertical, cada UF com mini-card
  esquerda (UF Fraunces + nº filiais) + 2 barras horizontais (atual + reforma)
  + alíquota efetiva direita.

**Tabela:** UF, Filiais, Receita, % receita, Imp. atual, Imp. reforma, Δ% (badge).

> **Nota:** o README original mencionava mapa do Brasil; o usuário **descartou** —
> a empresa só tem operações em UFs específicas, então treemap é mais útil.

---

### Tela 06 · Tendências 2026–2033 (`/tendencias`)

**Propósito:** visualizar a transição da reforma ao longo do tempo.

**Strip de marcos** (grid `repeat(4, 1fr)`):
- 2026: Início (azul) — CBS vigente · IBS em teste (0,1%)
- 2027: CBS plena (âmbar) — Extinção PIS/COFINS · IBS a 20%
- 2029: Meio caminho (âmbar) — IBS a 50% · ICMS/ISS reduzidos à metade
- 2033: Reforma completa (verde) — Extinção total ICMS/ISS

Cada card: borda esquerda 3px da cor do marco, ano em mono, título 13/600, descrição.

**Gráfico grande:**
- Toggle: Área (default) / Linha / Barra.
- Linha tracejada cinza (sem reforma, projeção 5% a.a.).
- Linha sólida + área azul preenchida (transição real).
- Pontos azuis em cada ano (markers).
- Linhas verticais âmbar tracejadas em 2027, 2029, 2033.

**Callout (card brand):** grid `1fr 1fr 1fr`:
- Economia acumulada 2025-2033: R$ 84,3 M (verde Fraunces 32px)
- Carga 2033 vs 2025: −10,8%
- Ano de breakeven: 2027

---

### Tela 07 · Dados Brutos (`/dados`)

**Propósito:** acesso completo + filtros + exportação.

**Toolbar:** busca esquerda + 3 chips de filtros ativos (Filiais 13, UFs 6,
Colunas 13/22) + botão primário "Exportar CSV" à direita.

**Tabela ampla:** sticky header em `--ink-50`, body com font-size 11px, padding
`8px`. Primeira coluna em sans-serif, demais em mono. Última coluna (Δ%)
colorida (verde/vermelho). Row de totais ao final em `--ink-50` bold.

**Funcionalidades obrigatórias:**
- Busca por texto (filial, UF, NCM).
- Filtros combináveis (filial, UF, porte, etc).
- Toggle de visibilidade de colunas (mostrar/ocultar).
- Ordenação clicável em qualquer coluna (asc/desc, indicador `↕` no header).
- Export CSV com BOM UTF-8 (`\uFEFF` no início) compatível com Excel-pt-BR.

---

## 6. Mobile (responsivo)

Foco principal: desktop. Mas todas as telas devem responder.

**Breakpoints:**
- `< 640px` (mobile): sidebar vira bottom tab bar (4 itens principais), topbar
  colapsa com hamburguer, KPIs grid `1fr 1fr`, tabelas viram lista ordenada
  simplificada, sliders empilham.
- `640–1024px` (tablet): sidebar colapsa para 56px (só ícones), KPIs grid
  `repeat(3, 1fr)`.
- `> 1024px` (desktop): layout completo.

**Mobile dashboard de referência** está no artboard "Mobile · 360px" do canvas.
Componentes adaptados:
- Hero compacto, número grande Fraunces 18px.
- KPIs em grid 2x2.
- Filiais em lista vertical com 2 micro-bars.
- Bottom tab bar 56px com ícones 18px.

Tabela pivot/dados brutos em mobile: lista com dimensão + total apenas, com
"Ver detalhes" expansível por linha.

---

## 7. Assets necessários

Nenhuma imagem real foi incluída. Os elementos visuais são:
- Logo Kliente 360 (SVG inline, `KlaLogo` em `components/shell.jsx`) —
  **substituir pelo SVG oficial** que está em `public/` do repo.
- Avatar empresa: iniciais sobre fundo brand. Quando houver logo do cliente,
  trocar por imagem real.
- Avatar usuário: iniciais sobre `--ink-200`. Substituir por foto se houver.
- Ícones: 12 SVGs inline em `components/shell.jsx` (ICONS const). Pode-se
  trocar por `lucide-react` mantendo nomes equivalentes.

---

## 8. Tweaks (configuração de workspace)

Tem 2 controles que devem ser persistidos por usuário/workspace:

1. **Cor primária** — color picker. Aplicado a `--kla-primary` e variantes.
2. **Modo escuro** — toggle. Aplica `data-theme="dark"` ao `<html>`.

**Implementação sugerida:** menu de preferências do usuário (no avatar topbar) +
persistência em `localStorage` ou no perfil do backend.

---

## 9. Arquivos no pacote

| Arquivo | Conteúdo |
|---|---|
| `Analitico KLA - Wireframes.html` | HTML root que monta o canvas com todas as 8 telas |
| `app.jsx` | Composição principal do canvas |
| `components/shell.jsx` | Sidebar + Topbar + Logo + ICONS |
| `components/dashboard.jsx` | Tela 01 — Visão Executiva (Hero, KPIs, donut, filial bars, timeline) |
| `components/pivot.jsx` | Tela 02 — Análise Multidimensional |
| `components/simulation.jsx` | Tela 03 — Simulação A/B |
| `components/extra-pages.jsx` | Telas 00 (Login), 04 (Setor), 05 (Regional), 06 (Tendências), 07 (Dados Brutos) |
| `components/mobile.jsx` | Mobile frame de referência |
| `styles/tokens.css` | **Tokens de design (importar como base no Tailwind config)** |
| `styles/wireframe.css` | Primitives sketchy (descartar — apenas para wireframe) |
| `design-canvas.jsx` / `tweaks-panel.jsx` | Wrappers de apresentação (descartar) |

---

## 10. Plano de implementação sugerido

### Sprint 1 — Foundation ✅
1. ✅ Importar tokens do `styles/tokens.css` para `tailwind.config.js` (extend theme.colors).
2. ✅ Adicionar fontes Inter + Fraunces + JetBrains Mono via Google Fonts.
3. ✅ Refatorar `Layout.tsx` com novo Sidebar + Topbar.
4. ✅ Atualizar `KpiCard` para o novo visual.
5. ✅ Implementar tweaks (cor primária + dark mode) via Zustand (`themeStore`).

### Sprint 2 — Core analytics ✅
6. ✅ Refazer Dashboard Executivo com Hero narrativo (tela 01).
7. ✅ Refazer Pivot com heatmap + insight strip (tela 02).
8. ✅ Refazer Simulação A/B com sliders + comparação 4-barras (tela 03).

### Sprint 3 — Resto ✅
9. ✅ Login redesenhado (tela 00).
10. ✅ Setor / Linha de Negócio (tela 04).
11. ✅ Regional com treemap (tela 05).
12. ✅ Tendências com timeline + marcos (tela 06).
13. ✅ Dados Brutos com export CSV (tela 07).

### Sprint 4 — Polish 🟡
14. 🟡 Responsividade — desktop/tablet OK; mobile bottom-tab pendente.
15. ⬜ Estados de loading, erro, vazio em todas as telas.
16. ⬜ Animações (transições entre rotas, sliders com debounce).
17. ✅ Testes (Vitest) — cobertura ≥ 50% branch, KpiCard/Pivot/themeStore/pages cobertos. CI/lint verdes.

---

## 11. Diferenciais de UX a manter

1. **Hero narrativo no dashboard.** Frase em linguagem natural com nome da empresa
   logada e número grande colorido. Personalizar por dados reais do tenant.
2. **Insights automáticos no Pivot.** Calcular maior contribuinte, tributo dominante
   e anomalias automaticamente — não exigir do usuário.
3. **Comparação A/B nativa na Simulação.** Sempre 2 cenários simultâneos + tabela
   por filial com Δ A e Δ B.

---

## 12. Como rodar este pacote localmente

Abra `Analitico KLA - Wireframes.html` em qualquer servidor estático
(`python -m http.server`, Live Server, etc). É **só referência** — o app real
roda no repositório `Kliente-360/analitico-kla` com `npm run dev`.

---

## 13. Dúvidas?

Voltar para o time de design para clarificações em qualquer ponto. Não inferir
comportamentos não documentados — perguntar.
