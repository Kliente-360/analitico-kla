# Analítico KLA — Guia de Uso para Novos Usuários

> **Para quem é este guia?**  
> Consultores tributários, gestores de carteira e diretores financeiros que estão conhecendo o Analítico KLA pela primeira vez — e querem extrair o máximo da ferramenta já na primeira sessão.

---

## O que você tem nas mãos

O Analítico KLA é uma plataforma de inteligência fiscal construída especificamente para a **Reforma Tributária brasileira (PEC 45/2019)**.

Ela substitui horas de trabalho em planilha por respostas em segundos:

| Sem o Analítico KLA | Com o Analítico KLA |
|---------------------|---------------------|
| Planilha manual por empresa | Visão consolidada de toda a carteira em uma tela |
| Cálculo de impacto vira consultoria ad hoc | Simulação de alíquotas em tempo real com sliders |
| Difícil comparar dois cenários de reforma | Modo A/B: dois cenários lado a lado com um clique |
| Relatório tributário demora dias | Exportação em PDF instantânea, pronta para apresentar ao cliente |
| Análise regional exige cruzamento de bases | Distribuição geográfica visualizada em treemap por estado |

---

## Antes de começar — 2 minutos de contexto

A Reforma Tributária **extingue 5 impostos** (IPI, PIS, COFINS, ICMS e ISS) e cria **2 novos** (CBS e IBS), com alíquota de referência entre **26% e 28%** sobre a mesma base.

O impacto varia muito por setor:

- **Comércio e Indústria** — tendem a ser beneficiados (créditos de entrada do ICMS/IPI são preservados no IBS/CBS)
- **Serviços** — atenção: pagavam ~12% (ISS + PIS/COFINS) e passam para 26–28%. O crédito de entrada em insumos pode mitigar, mas precisa de estudo caso a caso

A transição é gradual: 2026 a 2033. O Analítico KLA modela esse calendário mês a mês para cada empresa da carteira.

---

## Passo a Passo — Sua primeira sessão

### Passo 1 — Acesse o portal

Abra o link fornecido pelo time Kliente 360. Faça login com as credenciais recebidas.

> A tela de login é direta: e-mail + senha. Nenhuma instalação necessária — tudo roda no browser.

---

### Passo 2 — Dashboard Executivo: entenda a carteira em 30 segundos

Assim que entrar, você está no **Dashboard**. Aqui você vê:

- **Receita total da carteira** e número de empresas
- **Carga tributária atual** × **carga pós-reforma** (em R$ e %)
- **Impacto médio** da reforma sobre a carteira
- Gráficos de composição de impostos e comparativo por setor

**O que fazer aqui:**  
Identifique os setores com maior variação. Barras vermelhas = aumento de carga. Barras verdes = redução. Isso define quais clientes precisam de atenção prioritária.

> Dica: os widgets do dashboard são arrastáveis. Reorganize conforme o que é mais relevante para a sua apresentação.

---

### Passo 3 — Simulador de Cenários: ajuste as alíquotas e veja o impacto ao vivo

Clique na aba **Simulação**.

Você verá três sliders:
- **CBS** (substitui PIS + COFINS) — referência: ~8,8%
- **IBS — Bens** (substitui ICMS para comércio/indústria) — referência: ~17,7%
- **IBS — Serviços** (substitui ISS para prestadores) — referência: ~17,7%

Mova os sliders. Os gráficos e a tabela de impacto por empresa se atualizam **em tempo real**, sem recarregar a página.

**Ative o modo "Comparar dois cenários"** para colocar dois conjuntos de alíquotas lado a lado — útil para mostrar ao cliente a diferença entre o cenário oficial aprovado e um cenário mais favorável em discussão no Congresso.

> Esta é a funcionalidade que mais impressiona em uma reunião. Use-a ao vivo com o cliente.

---

### Passo 4 — Análise Setorial: mergulhe em um setor específico

Clique na aba **Setores**.

Escolha um setor da carteira (ex.: Saúde, Tecnologia, Comércio) e veja:
- Receita e carga tributária atual vs. pós-reforma
- Composição de impostos por setor (quais tributos pesam mais hoje)
- Dispersão receita × alíquota efetiva (empresas fora da curva ficam evidentes no scatter)
- Ranking de exposição à reforma

**Para empresas de serviço:** observe o gráfico de composição — a substituição do ISS pelo IBS/CBS costuma ser o maior vetor de aumento de carga. Use essa visualização para fundamentar a urgência de um planejamento tributário.

---

### Passo 5 — Análise Regional: identifique concentrações geográficas

Clique na aba **Regional**.

O treemap por estado mostra onde está concentrada a receita da carteira. Filtre por setor para ver, por exemplo, que empresas de serviço no estado de São Paulo têm exposição diferente das do Rio de Janeiro (alíquotas de ISS variam por município — e a reforma elimina essa variação).

---

### Passo 6 — Tendências 2021–2033: mostre o caminho da transição

Clique na aba **Tendências**.

Este gráfico é o mais poderoso para **construir urgência com o cliente**. Ele mostra:

- A linha de **regime atual** projetada até 2033
- A linha de **regime pós-reforma completa**
- A **curva de transição real**, seguindo o calendário oficial

Os marcos legislativos são exibidos no gráfico:
- **2026** — CBS entra em vigor, IBS em fase-teste (0,1%)
- **2027** — CBS plena, extinção de PIS/COFINS, IBS a 20%
- **2029** — IBS a 50%, ICMS/ISS reduzidos à metade
- **2033** — Extinção total de ICMS e ISS

> Use este gráfico para responder: *"Quando eu preciso me preocupar com isso?"* A resposta é: **agora**, porque o planejamento de créditos de entrada e estrutura societária precisa começar antes de 2026.

---

### Passo 7 — Tabela Dinâmica: análise personalizada sem precisar de TI

Clique na aba **Pivot**.

Selecione uma **dimensão de linha** (ex.: Setor) e uma **dimensão de coluna** (ex.: Porte) e escolha uma **métrica** (ex.: Variação % pós-reforma).

A tabela cruza os dados automaticamente, com totalizadores por linha e coluna.

**Exemplos de perguntas que você responde aqui em segundos:**
- "Qual região tem maior impacto médio da reforma?"
- "Empresas grandes do setor de serviços pagam mais ou menos que as pequenas?"
- "Qual setor tem a maior alíquota efetiva pós-reforma no Sudeste?"

---

### Passo 8 — Power BI Analítico: visão nota a nota

Clique na aba **Power BI**.

Esta seção apresenta análises baseadas em dados fiscais de entradas e saídas nota a nota, organizados em 8 sub-visões:

1. **Geral** — KPIs de receita, aquisições, saldo de tributos e mapa de bolhas por cidade
2. **Carga Efetiva** — evolução CBS/IBS por ano de transição (2024–2033) com gráfico empilhado
3. **Tributos** — quatro quadrantes: créditos/débitos no regime atual × créditos/débitos no novo regime
4. **Entradas por Produto** — pivot de aquisições com crédito de IBS/CBS por produto
5. **Saídas por Produto** — pivot de vendas com débito de IBS/CBS por produto
6. **DRE** — demonstração de resultado do exercício com impacto tributário linha a linha
7. **Mantendo o Preço** — comparativo: quanto a empresa ganha ou perde mantendo o preço atual após a reforma
8. **Simulador** — 10 variáveis ajustáveis (preço, alíquotas, retenções) com recálculo instantâneo

> Esta aba transforma o Analítico KLA de uma ferramenta de carteira para um **instrumento de diagnóstico empresa a empresa** — ideal para a fase de fechamento com o cliente.

---

### Passo 9 — Exporte e apresente

Em qualquer tela, clique no botão **Exportar PDF** (canto superior direito).

O portal gera uma versão impressa limpa — sem menus, sem botões, apenas os gráficos e tabelas — pronta para enviar ao cliente ou imprimir para a reunião.

---

## Roteiro sugerido para uma reunião de 30 minutos

| Tempo | O que fazer | Aba |
|-------|-------------|-----|
| 0–5 min | Contextualize: "A reforma já está aprovada. A questão agora é quanto vai custar para cada empresa." | — |
| 5–10 min | Mostre o Dashboard com a carteira do cliente | Dashboard |
| 10–15 min | Identifique os setores mais afetados | Setores |
| 15–22 min | Simule ao vivo com os sliders — ajuste para o setor do cliente | Simulação |
| 22–27 min | Mostre a curva de transição 2026–2033 | Tendências |
| 27–30 min | Proponha o próximo passo: diagnóstico individual com o Simulador nota a nota | Power BI |

---

## Perguntas frequentes

**Os dados são reais da minha empresa?**  
Esta versão é um protótipo com dados simulados. Na versão comercial, os dados são carregados diretamente da sua base fiscal (EFD, SPED, NF-e) via upload seguro.

**Posso compartilhar com meu time?**  
Sim. O portal suporta múltiplos usuários com login individual. Fale com o time Kliente 360 para criar acessos adicionais.

**Os cálculos seguem a legislação aprovada?**  
Sim. As alíquotas e o calendário de transição estão calibrados com base na PEC 45/2019 e nas resoluções do Comitê Gestor do IBS publicadas até a data desta versão.

**O que acontece depois do protótipo?**  
A versão comercial adiciona: dados reais via integração fiscal, relatórios em PDF por empresa, módulo de planejamento de créditos de entrada e suporte consultivo do time Kliente 360.

---

## Próximos passos

Depois desta sessão de degustação, o time **Kliente 360** está pronto para:

1. **Diagnóstico gratuito** — análise do impacto da reforma nas 3 empresas com maior exposição da sua carteira, com os dados reais
2. **Proposta comercial** — acesso completo ao Analítico KLA com integração fiscal e suporte dedicado
3. **Onboarding assistido** — implantação em até 5 dias úteis com treinamento do time

---

<div align="center">

**Dúvidas? Fale com um consultor KLA.**

*© 2025 Kliente 360 · Dados simulados para fins de demonstração*

</div>
