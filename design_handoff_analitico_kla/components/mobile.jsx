/* global React */
// Mobile dashboard frame — adaptação do mesmo conteúdo

function MobileDashboard() {
  return (
    <div style={{ width: 360, height: 720, background: 'var(--ink-50)', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 28, border: '8px solid #1a1f2c', position: 'relative' }}>
      {/* status bar */}
      <div style={{ height: 32, background: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', fontSize: 11, fontWeight: 600, color: 'var(--ink-900)', flexShrink: 0 }}>
        <span>9:41</span>
        <span>•••</span>
      </div>

      {/* Header */}
      <div style={{ background: 'var(--paper)', padding: '10px 16px 12px', borderBottom: '1px solid var(--ink-200)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 5, background: 'var(--kla-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11 }}>BT</div>
          <div style={{ flex: 1, lineHeight: 1.2 }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>Bodytech S.A.</div>
            <div style={{ fontSize: 10, color: 'var(--ink-500)' }}>FY 2025 · 13 filiais</div>
          </div>
          <span style={{ width: 24, height: 24, background: 'var(--ink-100)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-700)' }}>☰</span>
        </div>
      </div>

      {/* content scrollable */}
      <div style={{ flex: 1, overflow: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Hero */}
        <div className="wf-frame wf-frame--brand" style={{ padding: 14, background: 'var(--paper)', borderLeft: '3px solid var(--kla-primary)' }}>
          <div className="wf-label" style={{ color: 'var(--kla-primary)' }}>Impacto · Reforma</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, lineHeight: 1.15, margin: '6px 0', letterSpacing: '-0.01em' }}>
            <span style={{ color: 'var(--kla-accent-down)' }}>−R$ 4,2 M</span> em impostos pós-reforma
          </div>
          <div style={{ fontSize: 10, color: 'var(--ink-500)' }}>vs regime atual · alíquotas oficiais</div>
        </div>

        {/* KPIs row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { l: 'Receita', v: 'R$ 312M', d: '+8,4%', t: 'down' },
            { l: 'Carga atual', v: '12,4%', d: 'efetiva' },
            { l: 'Pós-reforma', v: '11,1%', d: '−1,3 p.p.', t: 'down' },
            { l: 'Filiais', v: '13', d: '6 UFs' },
          ].map(k => (
            <div key={k.l} className="wf-frame" style={{ padding: 10, background: 'var(--paper)' }}>
              <div className="wf-label">{k.l}</div>
              <div className="wf-num" style={{ fontSize: 18, marginTop: 2 }}>{k.v}</div>
              <div style={{ fontSize: 10, color: k.t === 'down' ? 'var(--kla-accent-down)' : 'var(--ink-500)', marginTop: 2, fontWeight: k.t ? 600 : 400 }}>{k.d}</div>
            </div>
          ))}
        </div>

        {/* Mini chart card */}
        <div className="wf-frame" style={{ padding: 12, background: 'var(--paper)' }}>
          <div className="wf-h" style={{ fontSize: 12 }}>Atual vs Reforma · top 5 filiais</div>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { n: 'SP — Pinheiros', c: 92, r: 79, d: -14 },
              { n: 'SP — Morumbi', c: 68, r: 61, d: -10 },
              { n: 'RJ — Barra', c: 60, r: 55, d: -8 },
              { n: 'MG — Savassi', c: 38, r: 40, d: 5 },
              { n: 'DF — Asa Sul', c: 30, r: 32, d: 6 },
            ].map(d => (
              <div key={d.n} style={{ fontSize: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ color: 'var(--ink-700)' }}>{d.n}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: d.d < 0 ? 'var(--kla-accent-down)' : 'var(--kla-accent-up)', fontWeight: 600 }}>{d.d > 0 ? '+' : ''}{d.d}%</span>
                </div>
                <div style={{ height: 5, background: 'var(--ink-100)', borderRadius: 2, marginBottom: 2 }}>
                  <div style={{ width: `${d.c}%`, height: '100%', background: 'var(--ink-500)', borderRadius: 2 }} />
                </div>
                <div style={{ height: 5, background: 'var(--ink-100)', borderRadius: 2 }}>
                  <div style={{ width: `${d.r}%`, height: '100%', background: 'var(--kla-primary)', borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alert */}
        <div className="wf-frame" style={{ padding: 12, background: '#fff8e6', borderColor: 'var(--kla-accent-warn)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--kla-accent-warn)' }}>⚠ Atenção · Filial DF</div>
          <div style={{ fontSize: 10, color: 'var(--ink-700)', marginTop: 4, lineHeight: 1.4 }}>
            +6% de carga após reforma. Avalie reorganização tributária.
          </div>
        </div>
      </div>

      {/* Bottom tab bar */}
      <div style={{ height: 56, background: 'var(--paper)', borderTop: '1px solid var(--ink-200)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', flexShrink: 0 }}>
        {[
          { l: 'Visão', i: ICONS.dash, active: true },
          { l: 'Pivot', i: ICONS.pivot },
          { l: 'Simular', i: ICONS.sim },
          { l: 'Mais', i: ICONS.raw },
        ].map(t => (
          <div key={t.l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, color: t.active ? 'var(--kla-primary)' : 'var(--ink-400)' }}>
            <Icon d={t.i} size={18} />
            <span style={{ fontSize: 9, fontWeight: t.active ? 600 : 400 }}>{t.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

window.MobileDashboard = MobileDashboard;
