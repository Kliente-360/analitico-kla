/* global React */
// Pivot Table — análise multidimensional dos dados da própria empresa

function PivotControls() {
  return (
    <div className="wf-frame" style={{ padding: 14, background: 'var(--paper)', display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span className="wf-label">Linhas</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <span className="wf-pill wf-pill--active">Filial</span>
          <span className="wf-pill">+</span>
        </div>
      </div>
      <div style={{ width: 1, height: 36, background: 'var(--ink-200)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span className="wf-label">Colunas</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <span className="wf-pill wf-pill--active">Tributo</span>
          <span className="wf-pill">+</span>
        </div>
      </div>
      <div style={{ width: 1, height: 36, background: 'var(--ink-200)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span className="wf-label">Métrica</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <span className="wf-pill wf-pill--active">Valor (R$)</span>
        </div>
      </div>
      <div style={{ width: 1, height: 36, background: 'var(--ink-200)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span className="wf-label">Regime</span>
        <div style={{ display: 'flex', gap: 6, background: 'var(--ink-100)', padding: 3, borderRadius: 6 }}>
          <span style={{ padding: '4px 10px', background: 'var(--paper)', borderRadius: 4, fontSize: 12, fontWeight: 600, boxShadow: 'var(--shadow-sm)' }}>Atual</span>
          <span style={{ padding: '4px 10px', fontSize: 12, color: 'var(--ink-500)' }}>Reforma</span>
          <span style={{ padding: '4px 10px', fontSize: 12, color: 'var(--ink-500)' }}>Δ</span>
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <button style={{ padding: '7px 12px', fontSize: 12, background: 'var(--paper)', border: '1px solid var(--ink-300)', borderRadius: 6, color: 'var(--ink-700)', cursor: 'pointer' }}>
        Salvar visão
      </button>
      <button style={{ padding: '7px 12px', fontSize: 12, background: 'var(--paper)', border: '1px solid var(--ink-300)', borderRadius: 6, color: 'var(--ink-700)', cursor: 'pointer', display: 'flex', gap: 4, alignItems: 'center' }}>
        <Icon d={ICONS.download} size={12} /> CSV
      </button>
    </div>
  );
}

function HeatCell({ value, max, tone = 'brand' }) {
  const intensity = Math.min(value / max, 1);
  const bg = tone === 'brand'
    ? `rgba(11, 61, 140, ${0.05 + intensity * 0.35})`
    : `rgba(15, 23, 34, ${0.03 + intensity * 0.18})`;
  return (
    <td style={{
      padding: '10px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)',
      fontSize: 12, color: 'var(--ink-900)', background: bg, position: 'relative',
    }}>
      {value > 0 ? value.toFixed(1) : '—'}
    </td>
  );
}

function PivotTable() {
  const cols = ['ICMS', 'COFINS', 'PIS', 'IRPJ', 'CSLL', 'ISS', 'Total'];
  const rows = [
    { name: 'SP — Pinheiros', vals: [4.2, 2.8, 1.3, 1.1, 0.4, 0.0, 9.8] },
    { name: 'SP — Morumbi',   vals: [3.1, 2.0, 0.9, 0.8, 0.4, 0.0, 7.2] },
    { name: 'RJ — Barra',     vals: [2.7, 1.7, 0.8, 0.7, 0.3, 0.2, 6.4] },
    { name: 'MG — Savassi',   vals: [1.6, 1.0, 0.5, 0.5, 0.2, 0.3, 4.1] },
    { name: 'RS — Moinhos',   vals: [1.4, 1.0, 0.5, 0.4, 0.2, 0.3, 3.8] },
    { name: 'DF — Asa Sul',   vals: [0.0, 0.7, 0.3, 0.4, 0.2, 1.6, 3.2] },
    { name: 'PR — Batel',     vals: [0.9, 0.7, 0.3, 0.3, 0.1, 0.3, 2.6] },
  ];
  const total = cols.map((_, ci) => rows.reduce((acc, r) => acc + r.vals[ci], 0));
  const max = 5;
  return (
    <div className="wf-frame" style={{ background: 'var(--paper)', overflow: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ background: 'var(--ink-50)' }}>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid var(--ink-200)', fontWeight: 600, color: 'var(--ink-500)', fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Filial</th>
            {cols.map((c, i) => (
              <th key={c} style={{
                padding: '12px', textAlign: 'right',
                borderBottom: '1px solid var(--ink-200)',
                fontWeight: i === cols.length - 1 ? 700 : 600,
                color: i === cols.length - 1 ? 'var(--kla-primary)' : 'var(--ink-500)',
                fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase',
                background: i === cols.length - 1 ? 'var(--kla-primary-100)' : 'transparent',
              }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={r.name} style={{ borderBottom: '1px solid var(--ink-100)' }}>
              <td style={{ padding: '10px 12px', fontWeight: 500, color: 'var(--ink-900)' }}>{r.name}</td>
              {r.vals.slice(0, -1).map((v, vi) => (
                <HeatCell key={vi} value={v} max={max} />
              ))}
              <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--kla-primary)', background: 'var(--kla-primary-100)' }}>
                {r.vals[r.vals.length - 1].toFixed(1)}
              </td>
            </tr>
          ))}
          <tr style={{ background: 'var(--ink-50)', fontWeight: 700 }}>
            <td style={{ padding: '12px', color: 'var(--ink-900)', fontSize: 12 }}>Total</td>
            {total.slice(0, -1).map((v, i) => (
              <td key={i} style={{ padding: '12px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-700)' }}>
                {v.toFixed(1)}
              </td>
            ))}
            <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--kla-primary)', background: 'var(--kla-primary)', color: 'white' }}>
              {total[total.length - 1].toFixed(1)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function PivotInsightStrip() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
      <div className="wf-frame" style={{ padding: 14, background: 'var(--paper)' }}>
        <div className="wf-label">Maior contribuinte</div>
        <div style={{ marginTop: 6, fontSize: 14, fontWeight: 600, color: 'var(--ink-900)' }}>SP — Pinheiros</div>
        <div style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 2 }}>R$ 9,8 M · 25% do total</div>
      </div>
      <div className="wf-frame" style={{ padding: 14, background: 'var(--paper)' }}>
        <div className="wf-label">Tributo dominante</div>
        <div style={{ marginTop: 6, fontSize: 14, fontWeight: 600, color: 'var(--ink-900)' }}>ICMS</div>
        <div style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 2 }}>R$ 13,9 M · 38% da carga</div>
      </div>
      <div className="wf-frame" style={{ padding: 14, background: 'var(--paper)' }}>
        <div className="wf-label">Anomalia detectada</div>
        <div style={{ marginTop: 6, fontSize: 14, fontWeight: 600, color: 'var(--kla-accent-warn)' }}>DF — Asa Sul</div>
        <div style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 2 }}>ISS responde por 50% da carga</div>
      </div>
    </div>
  );
}

function PivotPage() {
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--ink-50)', minHeight: '100%' }}>
      <div>
        <div className="wf-label" style={{ marginBottom: 4 }}>Análise Multidimensional</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, margin: 0, letterSpacing: '-0.02em', color: 'var(--ink-900)' }}>
          Cruze qualquer dimensão dos seus dados
        </h2>
        <p style={{ fontSize: 12, color: 'var(--ink-500)', margin: '4px 0 0' }}>
          Arraste dimensões para linhas, colunas e métricas. Salve visões para reusar em relatórios.
        </p>
      </div>

      <PivotControls />
      <PivotInsightStrip />
      <PivotTable />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--ink-500)' }}>
        <span>13 filiais · 7 tributos · agregação por soma · valores em R$ M</span>
        <span style={{ fontFamily: 'var(--font-mono)' }}>atualizado 25/04/2026 09:14</span>
      </div>
    </div>
  );
}

window.PivotPage = PivotPage;
