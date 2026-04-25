import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer'
import { FileDown } from 'lucide-react'
import { companies, SECTORS } from '../data/mockData'
import { GROWTH_RATE } from '../constants'

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, color: '#1a1a1a' },
  cover: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  coverTitle: { fontSize: 28, fontFamily: 'Helvetica-Bold', color: '#009900', marginBottom: 8 },
  coverSub: { fontSize: 14, color: '#666', marginBottom: 4 },
  coverDate: { fontSize: 10, color: '#999', marginTop: 16 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: '#009900', borderBottomWidth: 1, borderBottomColor: '#e0e0e0', paddingBottom: 4, marginBottom: 10 },
  row: { flexDirection: 'row', marginBottom: 4 },
  cell: { flex: 1, paddingHorizontal: 4, paddingVertical: 3 },
  header: { backgroundColor: '#009900', color: '#fff', fontFamily: 'Helvetica-Bold' },
  even: { backgroundColor: '#f9f9f9' },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  kpiCard: { width: '30%', backgroundColor: '#f0fff0', padding: 8, borderRadius: 4 },
  kpiLabel: { fontSize: 8, color: '#666', marginBottom: 2 },
  kpiValue: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#009900' },
  badge: { paddingHorizontal: 4, paddingVertical: 1, borderRadius: 3, fontSize: 9 },
  green: { backgroundColor: '#dcfce7', color: '#15803d' },
  red: { backgroundColor: '#fee2e2', color: '#b91c1c' },
  footer: { position: 'absolute', bottom: 20, left: 40, right: 40, textAlign: 'center', fontSize: 8, color: '#aaa' },
})

function fmtB(v: number) {
  const abs = Math.abs(v)
  if (abs >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(1)}B`
  if (abs >= 1_000)     return `R$ ${(v / 1_000).toFixed(0)}M`
  return `R$ ${v.toFixed(0)}K`
}

function ReportDocument() {
  const sum = (fn: (c: typeof companies[0]) => number) => companies.reduce((s, c) => s + fn(c), 0)

  const totalReceita = sum((c) => c.revenue)
  const totalAtual = sum((c) => c.totalTaxCurrent)
  const totalReforma = sum((c) => c.totalTaxReform)
  const mediaImpacto = sum((c) => c.taxDeltaPercent) / companies.length
  const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })

  const sectorStats = SECTORS.map((s) => {
    const cs = companies.filter((c) => c.sector === s)
    const rev = cs.reduce((t, c) => t + c.revenue, 0)
    const cur = cs.reduce((t, c) => t + c.totalTaxCurrent, 0)
    const ref = cs.reduce((t, c) => t + c.totalTaxReform, 0)
    const delta = cs.reduce((t, c) => t + c.taxDeltaPercent, 0) / cs.length
    return { sector: s, empresas: cs.length, receita: rev, atual: cur, reforma: ref, delta }
  }).sort((a, b) => b.receita - a.receita)

  const topImpact = [...companies]
    .sort((a, b) => Math.abs(b.taxDeltaPercent) - Math.abs(a.taxDeltaPercent))
    .slice(0, 8)

  const projYear2033Growth = Math.pow(1 + GROWTH_RATE, 2033 - 2025)

  return (
    <Document title="Analitico KLA — Relatório Executivo" author="Kliente 360">
      {/* Cover */}
      <Page size="A4" style={styles.page}>
        <View style={styles.cover}>
          <Text style={styles.coverTitle}>Analitico KLA</Text>
          <Text style={styles.coverSub}>Relatório Executivo — Reforma Tributária Brasileira</Text>
          <Text style={styles.coverSub}>Analytics &amp; Simulação CBS/IBS</Text>
          <Text style={styles.coverDate}>Gerado em {today} · by Kliente 360</Text>
        </View>
        <Text style={styles.footer}>Analitico KLA © 2025 Kliente 360 · Dados simulados para fins de demonstração</Text>
      </Page>

      {/* Executive Summary */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sumário Executivo</Text>
          <View style={styles.kpiGrid}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Total de Empresas</Text>
              <Text style={styles.kpiValue}>{companies.length}</Text>
              <Text style={styles.kpiLabel}>{SECTORS.length} setores</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Receita Total</Text>
              <Text style={styles.kpiValue}>{fmtB(totalReceita)}</Text>
              <Text style={styles.kpiLabel}>em R$ mil</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Impostos Atuais</Text>
              <Text style={styles.kpiValue}>{fmtB(totalAtual)}</Text>
              <Text style={styles.kpiLabel}>{((totalAtual / totalReceita) * 100).toFixed(1)}% da receita</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Impostos Pós-Reforma</Text>
              <Text style={styles.kpiValue}>{fmtB(totalReforma)}</Text>
              <Text style={styles.kpiLabel}>{((totalReforma / totalReceita) * 100).toFixed(1)}% da receita</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Impacto Médio</Text>
              <Text style={[styles.kpiValue, { color: mediaImpacto < 0 ? '#15803d' : '#b91c1c' }]}>
                {mediaImpacto >= 0 ? '+' : ''}{mediaImpacto.toFixed(1)}%
              </Text>
              <Text style={styles.kpiLabel}>variação pós-reforma</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Projeção 2033</Text>
              <Text style={styles.kpiValue}>{fmtB(totalReforma * projYear2033Growth)}</Text>
              <Text style={styles.kpiLabel}>impostos pós-reforma</Text>
            </View>
          </View>
          <Text style={{ fontSize: 9, color: '#666', lineHeight: 1.6 }}>
            Este relatório apresenta a análise de impacto da Reforma Tributária Brasileira para uma carteira de {companies.length} empresas
            distribuídas em {SECTORS.length} setores. A variação média de {mediaImpacto >= 0 ? '+' : ''}{mediaImpacto.toFixed(1)}%
            {mediaImpacto < 0 ? ' representa uma redução' : ' representa um aumento'} na carga tributária total durante a transição
            para o novo regime CBS/IBS (2026–2033).
          </Text>
        </View>
        <Text style={styles.footer}>Analitico KLA © 2025 Kliente 360</Text>
      </Page>

      {/* Sector Analysis */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Análise por Setor</Text>
          <View style={[styles.row, styles.header]}>
            <Text style={[styles.cell, { flex: 2 }]}>Setor</Text>
            <Text style={[styles.cell, { textAlign: 'right' }]}>Empresas</Text>
            <Text style={[styles.cell, { textAlign: 'right' }]}>Receita</Text>
            <Text style={[styles.cell, { textAlign: 'right' }]}>Impostos Atuais</Text>
            <Text style={[styles.cell, { textAlign: 'right' }]}>Pós-Reforma</Text>
            <Text style={[styles.cell, { textAlign: 'right' }]}>Impacto</Text>
          </View>
          {sectorStats.map((s, i) => (
            <View key={s.sector} style={[styles.row, i % 2 === 1 ? styles.even : {}]}>
              <Text style={[styles.cell, { flex: 2 }]}>{s.sector}</Text>
              <Text style={[styles.cell, { textAlign: 'right' }]}>{s.empresas}</Text>
              <Text style={[styles.cell, { textAlign: 'right' }]}>{fmtB(s.receita)}</Text>
              <Text style={[styles.cell, { textAlign: 'right' }]}>{fmtB(s.atual)}</Text>
              <Text style={[styles.cell, { textAlign: 'right' }]}>{fmtB(s.reforma)}</Text>
              <Text style={[styles.cell, { textAlign: 'right', color: s.delta < 0 ? '#15803d' : '#b91c1c' }]}>
                {s.delta >= 0 ? '+' : ''}{s.delta.toFixed(1)}%
              </Text>
            </View>
          ))}
        </View>
        <Text style={styles.footer}>Analitico KLA © 2025 Kliente 360</Text>
      </Page>

      {/* Top Impact Companies */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Empresas de Maior Impacto</Text>
          <Text style={{ fontSize: 9, color: '#666', marginBottom: 8 }}>
            Top 8 empresas por magnitude de variação na carga tributária (positivo ou negativo).
          </Text>
          <View style={[styles.row, styles.header]}>
            <Text style={[styles.cell, { flex: 2 }]}>Empresa</Text>
            <Text style={[styles.cell]}>Setor</Text>
            <Text style={[styles.cell, { textAlign: 'right' }]}>Regime Atual</Text>
            <Text style={[styles.cell, { textAlign: 'right' }]}>Pós-Reforma</Text>
            <Text style={[styles.cell, { textAlign: 'right' }]}>Variação</Text>
          </View>
          {topImpact.map((c, i) => (
            <View key={c.id} style={[styles.row, i % 2 === 1 ? styles.even : {}]}>
              <Text style={[styles.cell, { flex: 2 }]}>{c.name}</Text>
              <Text style={[styles.cell]}>{c.sector}</Text>
              <Text style={[styles.cell, { textAlign: 'right' }]}>{fmtB(c.totalTaxCurrent)}</Text>
              <Text style={[styles.cell, { textAlign: 'right' }]}>{fmtB(c.totalTaxReform)}</Text>
              <Text style={[styles.cell, { textAlign: 'right', color: c.taxDeltaPercent < 0 ? '#15803d' : '#b91c1c' }]}>
                {c.taxDeltaPercent >= 0 ? '+' : ''}{c.taxDeltaPercent.toFixed(1)}%
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notas Metodológicas</Text>
          <Text style={{ fontSize: 9, color: '#666', lineHeight: 1.6 }}>
            {'• CBS (Contribuição sobre Bens e Serviços): substitui PIS e COFINS. Alíquota de referência: 8,8%\n'}
            {'• IBS (Imposto sobre Bens e Serviços): substitui ICMS e ISS. Alíquotas variam por setor (5,0% a 20,0%)\n'}
            {'• IRPJ e CSLL: sem alteração pela reforma. Mantidos nas taxas atuais.\n'}
            {'• Transição: 2026–2033 (extinção progressiva de ICMS/ISS)\n'}
            {`• Projeções 2033 baseadas em crescimento anual de ${(GROWTH_RATE * 100).toFixed(0)}% a.a.\n`}
            {'• Dados: portfólio simulado para fins de demonstração.'}
          </Text>
        </View>
        <Text style={styles.footer}>Analitico KLA © 2025 Kliente 360 · Dados simulados para fins de demonstração</Text>
      </Page>
    </Document>
  )
}

export function ExportPdfButton() {
  return (
    <PDFDownloadLink
      document={<ReportDocument />}
      fileName={`analitico-kla-relatorio-${new Date().toISOString().slice(0, 10)}.pdf`}
      className="print:hidden flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-primary-50"
    >
      {({ loading }) => (
        <>
          <FileDown size={15} />
          <span className="hidden sm:inline">{loading ? '...' : 'PDF'}</span>
        </>
      )}
    </PDFDownloadLink>
  )
}
