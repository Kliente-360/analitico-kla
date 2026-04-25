# Analitico KLA — Analytics & Reforma Tributária

Portal de analytics empresarial com simulação de impactos da Reforma Tributária brasileira.
Desenvolvido por **Kliente 360**.

## Acesso

| Usuário | Senha |
|---------|-------|
| admin@kliente360.com | admin123 |
| demo@kliente360.com | demo@2025 |

## Stack

- **React 18 + TypeScript** — componentes fortemente tipados
- **Vite** — build ultrarrápido
- **Tailwind CSS** — design system com identidade Kliente 360 (#009900)
- **Recharts** — gráficos interativos
- **Zustand** — gerenciamento de estado de autenticação
- **Papa Parse** — exportação CSV

## Funcionalidades

| Aba | Descrição |
|-----|-----------|
| Dashboard | KPIs, composição de impostos, impacto por setor |
| Tabela Dinâmica | Pivot table com dimensões e métricas configuráveis |
| Simulação | Sliders de alíquotas CBS/IBS com impacto em tempo real |
| Por Setor | Análise gráfica por setor com filtros de região e porte |
| Regional | Treemap por estado, análise por região |
| Tendências | Projeção 2021–2033 com cronograma da transição |
| Dados Brutos | Tabela completa com busca, filtros e exportação CSV |

## Desenvolvimento

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # produção
```

## Dados

35 empresas simuladas cobrindo 10 setores (Tecnologia, Varejo, Indústria, Agronegócio, Saúde,
Construção Civil, Financeiro, Telecomunicações, Energia, Serviços) em 12 estados brasileiros.

Reforma tributária modelada com alíquotas da CBS (substitui PIS/COFINS) e IBS (substitui ICMS/ISS),
com cronograma de transição 2026–2033 conforme PEC 45/2019.
