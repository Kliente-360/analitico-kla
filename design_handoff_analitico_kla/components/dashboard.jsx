/* global React */
// Dashboard Executivo — single-tenant, foco em uma empresa

function KpiCard({ label, value, unit, delta, deltaLabel, tone = 'neutral', big }) {
  const toneColor = tone === 'up' ? 'var(--kla-accent-up)' : tone === 'down' ? 'var(--kla-accent-down)' : 'var(--ink-500)';
  return (
    <div className="wf-frame" style={{ padding: big ? 18 : 14, background: 'var(--paper)', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div className="wf-label">{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <div className="wf-num" style={{ fontSize: big ? 34 : 24 }}>{value}</div>
        {unit && <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>{unit}</div>}
      </div>
      {delta && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: toneColor, fontWeight: 600 }}>
          <span style={{ fontFamily: 'var(--font-mono)' }}>{delta}</span>
          <span style={{ color: 'var(--ink-500)', fontWeight: 400 }}>{deltaLabel}</span>
        </div>
      )}
    </div>
  );
}

function HeroImpact() {
  return (
    <div className="wf-frame wf-frame--brand" style={{
      padding: 22, background: 'linear-gradient(180deg, var(--kla-primary-100) 0%, var(--paper) 100%)',
      gridColumn: 'span 12', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, alignItems: 'center',
    }}>
      <div>
        <div className="wf-label" style={{ color: 'var(--kla-primary)' }}>Impacto consolidado · Reforma Tributária</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, lineHeight: 1.1, margin: '8px 0 6px', color: 'var(--ink-900)', letterSpacing: '-0.02em' }}>
          A Bodytech vai pagar <span style={{ color: 'var(--kla-accent-down)' }}>R$ 4,2 M a menos</span> de imposto no regime pós-reforma
        </h1>
        <p style={{ fontSize: 13, color: 'var(--ink-500)', lineHeight: 1.5, margin: 0 }}>
          Considerando alíquotas oficiais (CBS 8,8% · IBS 17,7%) aplicadas sobre sua receita de R$ 312 M em 2025.
          O impacto positivo vem da extinção do ICMS em filiais com alta operação interestadual.
        </p>
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <button style={{ padding: '8px 14px', background: 'var(--kla-primary)', color: 'white', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            Simular outro cenário →
          </button>
          <button style={{ padding: '8px 14px', background: 'var(--paper)', color: 'var(--kla-primary)', border: '1px solid var(--kla-primary-300)', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            Ver memorial de cálculo
          </button>
        </div>
      </div>

      {/* Big comparative bars — atual vs reforma */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span className="wf-label">Regime atual</span>
            <span className="wf-num" style={{ fontSize: 18 }}>R$ 38,9 M</span>
          </div>
          <div style={{ height: 28, background: 'var(--ink-100)', borderRadius: 4, overflow: 'hidden' }}>
            <div className="wf-bar" style={{ width: '92%', height: '100%', background: 'var(--ink-500)' }} />
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span className="wf-label" style={{ color: 'var(--kla-primary)' }}>Pós-reforma (oficial)</span>
            <span className="wf-num" style={{ fontSize: 18, color: 'var(--kla-primary)' }}>R$ 34,7 M</span>
          </div>
          <div style={{ height: 28, background: 'var(--ink-100)', borderRadius: 4, overflow: 'hidden' }}>
            <div className="wf-bar wf-bar--brand" style={{ width: '82%', height: '100%' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
            <span style={{ fontSize: 11, color: 'var(--kla-accent-down)', fontWeight: 600 }}>−10,8% · economia estimada</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, span = 6, height = 200, children, footer }) {
  return (
    <div className="wf-frame" style={{ padding: 16, background: 'var(--paper)', gridColumn: `span ${span}`, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div className="wf-h" style={{ fontSize: 13 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 2 }}>{subtitle}</div>}
        </div>
        <button style={{ background: 'transparent', border: 'none', color: 'var(--ink-400)', cursor: 'pointer', fontSize: 16 }}>⋯</button>
      </div>
      <div style={{ height, position: 'relative' }}>{children}</div>
      {footer && <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--ink-100)', fontSize: 11, color: 'var(--ink-500)' }}>{footer}</div>}
    </div>
  );
}

function CompositionDonut() {
  // Sketchy donut — segments via conic-gradient
  const segments = [
    { label: 'ICMS', val: 38, color: 'var(--kla-primary)' },
    { label: 'COFINS', val: 22, color: 'var(--kla-primary-500)' },
    { label: 'PIS', val: 10, color: 'var(--kla-primary-300)' },
    { label: 'IRPJ', val: 16, color: 'var(--ink-500)' },
    { label: 'CSLL', val: 9, color: 'var(--ink-400)' },
    { label: 'ISS', val: 5, color: 'var(--ink-300)' },
  ];
  let acc = 0;
  const stops = segments.map(s => {
    const start = acc; acc += s.val;
    return `${s.color} ${start}% ${acc}%`;
  }).join(', ');
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, height: '100%' }}>
      <div style={{
        width: 140, height: 140, borderRadius: '50%',
        background: `conic-gradient(${stops})`,
        position: 'relative', flexShrink: 0,
      }}>
        <div style={{
          position: 'absolute', inset: 26, background: 'var(--paper)', borderRadius: '50%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <div className="wf-label">total atual</div>
          <div className="wf-num" style={{ fontSize: 18 }}>R$ 38,9M</div>
        </div>
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {segments.map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
            <span style={{ width: 10, height: 10, background: s.color, borderRadius: 2, flexShrink: 0 }} />
            <span style={{ color: 'var(--ink-700)', flex: 1 }}>{s.label}</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-500)' }}>{s.val}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilialBars() {
  const data = [
    { name: 'Filial SP — Pinheiros', cur: 9.8, ref: 8.4, delta: -14 },
    { name: 'Filial SP — Morumbi', cur: 7.2, ref: 6.5, delta: -10 },
    { name: 'Filial RJ — Barra', cur: 6.4, ref: 5.9, delta: -8 },
    { name: 'Filial MG — Savassi', cur: 4.1, ref: 4.3, delta: 5 },
    { name: 'Filial RS — Moinhos', cur: 3.8, ref: 3.6, delta: -5 },
    { name: 'Filial DF — Asa Sul', cur: 3.2, ref: 3.4, delta: 6 },
    { name: 'Filial PR — Batel', cur: 2.6, ref: 2.4, delta: -8 },
    { name: 'Demais (5)', cur: 1.8, ref: 1.7, delta: -6 },
  ];
  const max = 12;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%', overflow: 'hidden' }}>
      {data.map(d => (
        <div key={d.name} style={{ display: 'grid', gridTemplateColumns: '160px 1fr 60px', alignItems: 'center', gap: 10, fontSize: 11 }}>
          <div style={{ color: 'var(--ink-700)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</div>
          <div style={{ position: 'relative', height: 14, background: 'var(--ink-100)', borderRadius: 2 }}>
            <div className="wf-bar" style={{ position: 'absolute', left: 0, top: 0, height: 6, width: `${(d.cur / max) * 100}%`, background: 'var(--ink-500)' }} />
            <div className="wf-bar wf-bar--brand" style={{ position: 'absolute', left: 0, top: 8, height: 6, width: `${(d.ref / max) * 100}%` }} />
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', color: d.delta < 0 ? 'var(--kla-accent-down)' : 'var(--kla-accent-up)', fontWeight: 600, textAlign: 'right' }}>
            {d.delta > 0 ? '+' : ''}{d.delta}%
          </div>
        </div>
      ))}
    </div>
  );
}

function TimelineProjection() {
  const years = [2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033];
  const cur = [38.9, 40.8, 42.9, 45.0, 47.3, 49.6, 52.1, 54.7, 57.4];
  const ref = [38.9, 38.4, 36.2, 35.5, 35.0, 34.8, 34.7, 34.7, 34.7];
  const max = 60;
  return (
    <div style={{ position: 'relative', height: '100%', padding: '4px 0 22px' }}>
      <svg width="100%" height="100%" viewBox="0 0 400 180" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
        {/* gridlines */}
        {[0, 30, 60, 90, 120, 150].map(y => (
          <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="var(--ink-100)" strokeWidth="1" />
        ))}
        {/* atual line — dashed */}
        <polyline fill="none" stroke="var(--ink-500)" strokeWidth="1.8" strokeDasharray="4 3"
          points={cur.map((v, i) => `${(i / (years.length - 1)) * 400},${180 - (v / max) * 160}`).join(' ')} />
        {/* reform line — brand solid + filled area */}
        <polygon fill="var(--kla-primary-100)" stroke="none"
          points={`0,180 ${ref.map((v, i) => `${(i / (years.length - 1)) * 400},${180 - (v / max) * 160}`).join(' ')} 400,180`} />
        <polyline fill="none" stroke="var(--kla-primary)" strokeWidth="2.2"
          points={ref.map((v, i) => `${(i / (years.length - 1)) * 400},${180 - (v / max) * 160}`).join(' ')} />
        {/* milestone marker — 2027 */}
        <line x1={`${(2 / 8) * 400}`} y1="0" x2={`${(2 / 8) * 400}`} y2="180" stroke="var(--kla-accent-warn)" strokeWidth="1" strokeDasharray="2 2" />
      </svg>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--ink-400)', fontFamily: 'var(--font-mono)' }}>
        {years.map(y => <span key={y}>{y}</span>)}
      </div>
      <div style={{ position: 'absolute', top: 6, right: 8, display: 'flex', gap: 12, fontSize: 10 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 14, height: 2, borderTop: '2px dashed var(--ink-500)' }} /> Sem reforma
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 14, height: 2, background: 'var(--kla-primary)' }} /> Com reforma
        </span>
      </div>
    </div>
  );
}

function AlertCard() {
  return (
    <div className="wf-frame" style={{ padding: 14, background: '#fff8e6', borderColor: 'var(--kla-accent-warn)', gridColumn: 'span 4' }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--kla-accent-warn)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700 }}>!</div>
        <div>
          <div className="wf-h" style={{ fontSize: 12 }}>Atenção · Filial DF</div>
          <div style={{ fontSize: 11, color: 'var(--ink-700)', marginTop: 4, lineHeight: 1.4 }}>
            Operação majoritariamente de serviço prevê <strong>+6%</strong> de carga após reforma. Avalie reorganização tributária.
          </div>
          <div style={{ fontSize: 11, color: 'var(--kla-primary)', fontWeight: 600, marginTop: 8 }}>Ver simulação detalhada →</div>
        </div>
      </div>
    </div>
  );
}

function DashboardExec() {
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--ink-50)', minHeight: '100%' }}>
      {/* breadcrumb + page title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div className="wf-label" style={{ marginBottom: 4 }}>Visão Executiva</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, margin: 0, letterSpacing: '-0.02em', color: 'var(--ink-900)' }}>
            Como a Reforma Tributária impacta sua operação
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="wf-pill wf-pill--active">Reforma oficial</span>
          <span className="wf-pill">Cenário conservador</span>
          <span className="wf-pill">Cenário agressivo</span>
        </div>
      </div>

      {/* Hero + KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 12 }}>
        <HeroImpact />

        <KpiCard label="Receita anual 2025" value="R$ 312" unit="M" delta="+8,4%" deltaLabel="vs 2024" tone="down" />
        <KpiCard label="Carga atual" value="12,4" unit="%" delta="alíq. efetiva" deltaLabel="" />
        <KpiCard label="Carga pós-reforma" value="11,1" unit="%" delta="−1,3 p.p." deltaLabel="alíq. efetiva" tone="down" />
        <KpiCard label="Filiais analisadas" value="13" unit="ativas" delta="6 UFs" deltaLabel="" />
        <KpiCard label="Período pleno" value="2033" unit="ref. completa" delta="−10,8%" deltaLabel="vs 2025" tone="down" />
        <AlertCard />

        {/* Charts row 1 */}
        <ChartCard title="Composição de impostos · regime atual" subtitle="Como sua carga de R$ 38,9 M está distribuída hoje" span={5} height={180}>
          <CompositionDonut />
        </ChartCard>

        <ChartCard title="Carga por filial · atual vs pós-reforma" subtitle="Ordenado pela maior contribuição" span={7} height={210} footer="● Atual   ● Pós-reforma · 13 filiais">
          <FilialBars />
        </ChartCard>

        {/* Timeline */}
        <ChartCard title="Projeção 2025 → 2033 · transição da reforma" subtitle="Carga tributária total ao longo da transição (R$ Milhões)" span={12} height={210} footer="Marco destacado: 2027 — CBS plena, ICMS/ISS reduzidos a 90%">
          <TimelineProjection />
        </ChartCard>
      </div>
    </div>
  );
}

window.DashboardExec = DashboardExec;
