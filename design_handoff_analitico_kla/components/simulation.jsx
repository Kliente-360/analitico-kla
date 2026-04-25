/* global React */
// Simulação de Cenários — sliders + comparação A/B

function Slider({ label, value, min, max, unit, color = 'var(--kla-primary)', help }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-900)' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, color }}>
          {value}{unit}
        </span>
      </div>
      <div style={{ position: 'relative', height: 6, background: 'var(--ink-100)', borderRadius: 3 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, background: color, borderRadius: 3 }} />
        <div style={{
          position: 'absolute', left: `${pct}%`, top: '50%', transform: 'translate(-50%, -50%)',
          width: 16, height: 16, background: 'var(--paper)', border: `2px solid ${color}`,
          borderRadius: '50%', boxShadow: 'var(--shadow-sm)',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: 'var(--ink-400)', fontFamily: 'var(--font-mono)' }}>
        <span>{min}{unit}</span>
        <span style={{ color: 'var(--ink-500)' }}>{help}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

function ScenarioCard({ tag, title, color, sliders, total, delta, deltaTone, accent = false }) {
  return (
    <div className="wf-frame" style={{
      padding: 16, background: accent ? 'var(--kla-primary-100)' : 'var(--paper)',
      borderColor: accent ? 'var(--kla-primary)' : 'var(--ink-200)',
      borderWidth: accent ? 1.5 : 1,
      display: 'flex', flexDirection: 'column', gap: 14,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
            padding: '3px 8px', background: color, color: 'white', borderRadius: 3,
            letterSpacing: '0.06em',
          }}>{tag}</span>
          <span className="wf-h" style={{ fontSize: 13 }}>{title}</span>
        </div>
        <button style={{ background: 'transparent', border: 'none', color: 'var(--ink-400)', cursor: 'pointer', fontSize: 11 }}>resetar</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {sliders.map(s => <Slider key={s.label} {...s} color={color} />)}
      </div>

      <hr className="wf-divider" />

      <div>
        <div className="wf-label" style={{ marginBottom: 4 }}>Carga total simulada</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span className="wf-num" style={{ fontSize: 28 }}>{total}</span>
          <span style={{ fontSize: 12, color: 'var(--ink-500)' }}>R$ M</span>
        </div>
        <div style={{ marginTop: 4, fontSize: 12, color: deltaTone === 'down' ? 'var(--kla-accent-down)' : 'var(--kla-accent-up)', fontWeight: 600 }}>
          {delta} <span style={{ color: 'var(--ink-500)', fontWeight: 400 }}>vs regime atual (R$ 38,9 M)</span>
        </div>
      </div>
    </div>
  );
}

function ComparisonBars() {
  const items = [
    { label: 'Atual', value: 38.9, color: 'var(--ink-500)' },
    { label: 'Reforma oficial', value: 34.7, color: 'var(--kla-primary)' },
    { label: 'Cenário A', value: 32.4, color: '#0a8f6e' },
    { label: 'Cenário B', value: 41.2, color: '#c9532f' },
  ];
  const max = 45;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 18, height: 200, padding: '0 8px 24px' }}>
      {items.map(it => (
        <div key={it.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%' }}>
          <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
            <div style={{
              width: '100%', height: `${(it.value / max) * 100}%`,
              background: it.color, borderRadius: '4px 4px 0 0',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)',
                fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: it.color, whiteSpace: 'nowrap',
              }}>R$ {it.value}M</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-700)', fontWeight: 500, textAlign: 'center' }}>{it.label}</div>
        </div>
      ))}
    </div>
  );
}

function FilialCompareTable() {
  const rows = [
    { name: 'SP — Pinheiros',  cur: 9.8, a: 7.9, b: 10.4, da: -19, db: 6 },
    { name: 'SP — Morumbi',    cur: 7.2, a: 5.8, b: 7.8,  da: -19, db: 8 },
    { name: 'RJ — Barra',      cur: 6.4, a: 5.4, b: 7.0,  da: -16, db: 9 },
    { name: 'MG — Savassi',    cur: 4.1, a: 3.5, b: 4.8,  da: -15, db: 17 },
    { name: 'DF — Asa Sul',    cur: 3.2, a: 3.1, b: 4.2,  da: -3,  db: 31 },
  ];
  return (
    <div className="wf-frame" style={{ background: 'var(--paper)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ background: 'var(--ink-50)' }}>
            <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Filial</th>
            <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: 11, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Atual</th>
            <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: 11, color: '#0a8f6e', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Cenário A</th>
            <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: 11, color: '#0a8f6e', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Δ A</th>
            <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: 11, color: '#c9532f', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Cenário B</th>
            <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: 11, color: '#c9532f', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Δ B</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.name} style={{ borderTop: '1px solid var(--ink-100)' }}>
              <td style={{ padding: '10px 12px', fontWeight: 500 }}>{r.name}</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--ink-700)' }}>{r.cur.toFixed(1)}</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{r.a.toFixed(1)}</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: r.da < 0 ? 'var(--kla-accent-down)' : 'var(--kla-accent-up)', fontWeight: 600 }}>
                {r.da > 0 ? '+' : ''}{r.da}%
              </td>
              <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{r.b.toFixed(1)}</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: r.db < 0 ? 'var(--kla-accent-down)' : 'var(--kla-accent-up)', fontWeight: 600 }}>
                {r.db > 0 ? '+' : ''}{r.db}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SimulationPage() {
  const sliderA = [
    { label: 'CBS', value: 7.5, min: 0, max: 15, unit: '%', help: 'subst. PIS+COFINS' },
    { label: 'IBS — Bens', value: 14.0, min: 0, max: 30, unit: '%', help: 'subst. ICMS' },
    { label: 'IBS — Serviços', value: 12.0, min: 0, max: 20, unit: '%', help: 'subst. ISS' },
  ];
  const sliderB = [
    { label: 'CBS', value: 9.5, min: 0, max: 15, unit: '%', help: 'subst. PIS+COFINS' },
    { label: 'IBS — Bens', value: 19.0, min: 0, max: 30, unit: '%', help: 'subst. ICMS' },
    { label: 'IBS — Serviços', value: 16.0, min: 0, max: 20, unit: '%', help: 'subst. ISS' },
  ];
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--ink-50)', minHeight: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div className="wf-label" style={{ marginBottom: 4 }}>Simulação de Cenários</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, margin: 0, letterSpacing: '-0.02em', color: 'var(--ink-900)' }}>
            E se a alíquota fosse outra?
          </h2>
          <p style={{ fontSize: 12, color: 'var(--ink-500)', margin: '4px 0 0' }}>
            Ajuste CBS e IBS e veja em tempo real o impacto sobre a Bodytech. Compare dois cenários lado a lado.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span className="wf-pill">↻ Resetar tudo</span>
          <span className="wf-pill wf-pill--active">Comparar A vs B</span>
          <span className="wf-pill">Salvar cenário</span>
        </div>
      </div>

      {/* Comparison row */}
      <div className="wf-frame" style={{ padding: 18, background: 'var(--paper)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
          <div>
            <div className="wf-h" style={{ fontSize: 13 }}>Resumo comparativo</div>
            <div style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 2 }}>Carga total da Bodytech sob 4 regimes</div>
          </div>
          <div className="wf-note">A: −R$ 6,5M · B: +R$ 2,3M</div>
        </div>
        <ComparisonBars />
      </div>

      {/* Two scenarios side-by-side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <ScenarioCard tag="CENÁRIO A" title="Otimista · alíquotas reduzidas" color="#0a8f6e" sliders={sliderA} total="32,4" delta="−R$ 6,5 M (−16,7%)" deltaTone="down" />
        <ScenarioCard tag="CENÁRIO B" title="Conservador · alíquotas elevadas" color="#c9532f" sliders={sliderB} total="41,2" delta="+R$ 2,3 M (+5,9%)" deltaTone="up" />
      </div>

      {/* Per-filial table */}
      <div>
        <div className="wf-h" style={{ fontSize: 13, marginBottom: 8 }}>Impacto por filial</div>
        <FilialCompareTable />
      </div>
    </div>
  );
}

window.SimulationPage = SimulationPage;
