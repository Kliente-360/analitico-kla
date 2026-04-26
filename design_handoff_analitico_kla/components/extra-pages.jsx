/* global React */
// Telas restantes: Login, Setor, Regional (single-tenant: filiais/UFs próprias),
// Tendências 2026-2033, Dados Brutos

// ─────────── LOGIN ───────────
function LoginPage() {
  return (
    <div style={{ width: 1280, height: 820, display: 'grid', gridTemplateColumns: '1fr 1.1fr', background: 'var(--paper)' }}>
      {/* left brand panel */}
      <div style={{
        background: 'linear-gradient(160deg, var(--kla-ink) 0%, var(--kla-ink-700) 100%)',
        color: 'white', padding: 60, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'white' }}>
          <svg width="28" height="28" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="white" /><circle cx="16" cy="16" r="8" fill="none" stroke="var(--kla-primary)" strokeWidth="2.5" /><circle cx="22" cy="10" r="2.5" fill="var(--kla-primary)" /></svg>
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Kliente 360</div>
            <div style={{ fontSize: 10, opacity: 0.7, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2 }}>Analítico KLA</div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, opacity: 0.7, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Inteligência tributária</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 44, lineHeight: 1.05, margin: '0 0 16px', letterSpacing: '-0.02em', textWrap: 'balance' }}>
            Veja o impacto da Reforma sobre a sua operação — em segundos.
          </h1>
          <p style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.5, maxWidth: 440, margin: 0 }}>
            Carregue seus dados, simule cenários CBS/IBS e descubra exatamente quanto sua empresa vai pagar
            de imposto entre 2026 e 2033.
          </p>
        </div>

        <div style={{ fontSize: 11, opacity: 0.6 }}>
          © 2026 Kliente 360 · Consultoria Salesforce oficial · contato@kliente360.com
        </div>

        {/* subtle decorative pattern */}
        <svg style={{ position: 'absolute', bottom: -100, right: -100, opacity: 0.08 }} width="500" height="500" viewBox="0 0 500 500">
          <circle cx="250" cy="250" r="240" fill="none" stroke="white" strokeWidth="1" />
          <circle cx="250" cy="250" r="180" fill="none" stroke="white" strokeWidth="1" />
          <circle cx="250" cy="250" r="120" fill="none" stroke="white" strokeWidth="1" />
          <circle cx="250" cy="250" r="60" fill="none" stroke="white" strokeWidth="1" />
        </svg>
      </div>

      {/* right form panel */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ width: 380 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: '0 0 6px', letterSpacing: '-0.02em' }}>Entrar no portal</h2>
          <p style={{ fontSize: 13, color: 'var(--ink-500)', margin: '0 0 28px' }}>Acesse com suas credenciais Kliente 360.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-700)', display: 'block', marginBottom: 6 }}>E-mail corporativo</label>
              <div className="wf-frame" style={{ padding: '10px 14px', background: 'var(--paper)', fontSize: 13, color: 'var(--ink-400)' }}>
                voce@suaempresa.com.br
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-700)', display: 'block', marginBottom: 6 }}>Senha</label>
              <div className="wf-frame" style={{ padding: '10px 14px', background: 'var(--paper)', fontSize: 13, color: 'var(--ink-400)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>••••••••••</span>
                <span style={{ fontSize: 11, color: 'var(--kla-primary)', fontWeight: 600, cursor: 'pointer' }}>mostrar</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--ink-700)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 14, height: 14, border: '1.5px solid var(--ink-300)', borderRadius: 3, background: 'var(--kla-primary)', position: 'relative' }}>
                  <span style={{ position: 'absolute', inset: 0, color: 'white', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</span>
                </span>
                Lembrar deste dispositivo
              </label>
              <a style={{ color: 'var(--kla-primary)', fontWeight: 600, textDecoration: 'none' }}>Esqueci a senha</a>
            </div>
            <button style={{ marginTop: 4, padding: '12px', background: 'var(--kla-primary)', color: 'white', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Entrar
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink-400)', fontSize: 11 }}>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--ink-200)' }} />
              ou
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--ink-200)' }} />
            </div>

            <button style={{ padding: '11px', background: 'var(--paper)', color: 'var(--ink-700)', border: '1px solid var(--ink-300)', borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span style={{ width: 14, height: 14, background: '#1798c1', borderRadius: 2 }} />
              Continuar com Salesforce SSO
            </button>
          </div>

          <div style={{ marginTop: 28, fontSize: 12, color: 'var(--ink-500)', textAlign: 'center' }}>
            Primeira vez por aqui? <a style={{ color: 'var(--kla-primary)', fontWeight: 600 }}>Solicite acesso</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────── POR LINHA DE NEGÓCIO ───────────
function SectorPage() {
  const sectors = [
    { name: 'Academias premium', rev: 168, cur: 22.1, ref: 19.4, delta: -12, color: 'var(--kla-primary)' },
    { name: 'Estúdios funcional', rev: 64,  cur: 7.8, ref: 6.9, delta: -11, color: 'var(--kla-primary-500)' },
    { name: 'Lojas (varejo)', rev: 48,  cur: 5.2, ref: 4.1, delta: -21, color: 'var(--kla-primary-300)' },
    { name: 'Nutrição (serviço)', rev: 24, cur: 2.4, ref: 2.7, delta: 12, color: 'var(--ink-500)' },
    { name: 'Personal trainer', rev: 8, cur: 1.4, ref: 1.6, delta: 14, color: 'var(--ink-400)' },
  ];
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--ink-50)', minHeight: '100%' }}>
      <div>
        <div className="wf-label" style={{ marginBottom: 4 }}>Por Linha de Negócio</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, margin: 0, letterSpacing: '-0.02em' }}>
          Como cada linha de negócio reage à reforma
        </h2>
        <p style={{ fontSize: 12, color: 'var(--ink-500)', margin: '4px 0 0' }}>
          As 5 linhas que compõem sua receita de R$ 312 M em 2025. Linhas de serviço puro tendem a aumentar a carga.
        </p>
      </div>

      {/* filters */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span className="wf-label">Filtrar:</span>
        <span className="wf-pill wf-pill--active">Todas as filiais</span>
        <span className="wf-pill">Apenas SP</span>
        <span className="wf-pill">Apenas Sudeste</span>
        <div style={{ flex: 1 }} />
        <span className="wf-pill">↕ ordenar por receita</span>
      </div>

      {/* main split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12 }}>
        {/* horizontal bars */}
        <div className="wf-frame" style={{ padding: 18, background: 'var(--paper)' }}>
          <div className="wf-h" style={{ fontSize: 13, marginBottom: 4 }}>Carga atual vs pós-reforma · por linha</div>
          <div style={{ fontSize: 11, color: 'var(--ink-500)', marginBottom: 14 }}>R$ Milhões/ano</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {sectors.map(s => (
              <div key={s.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                  <span style={{ color: 'var(--ink-900)', fontWeight: 500 }}>{s.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: s.delta < 0 ? 'var(--kla-accent-down)' : 'var(--kla-accent-up)', fontWeight: 600 }}>
                    {s.delta > 0 ? '+' : ''}{s.delta}%
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 60px', gap: 8, alignItems: 'center', fontSize: 10, color: 'var(--ink-500)' }}>
                  <span>atual</span>
                  <div style={{ height: 10, background: 'var(--ink-100)', borderRadius: 2, position: 'relative' }}>
                    <div style={{ width: `${(s.cur / 25) * 100}%`, height: '100%', background: 'var(--ink-500)', borderRadius: 2 }} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', textAlign: 'right' }}>R$ {s.cur}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 60px', gap: 8, alignItems: 'center', fontSize: 10, color: 'var(--kla-primary)', marginTop: 3 }}>
                  <span>reforma</span>
                  <div style={{ height: 10, background: 'var(--ink-100)', borderRadius: 2, position: 'relative' }}>
                    <div style={{ width: `${(s.ref / 25) * 100}%`, height: '100%', background: 'var(--kla-primary)', borderRadius: 2 }} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', textAlign: 'right' }}>R$ {s.ref}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* scatter */}
        <div className="wf-frame" style={{ padding: 18, background: 'var(--paper)' }}>
          <div className="wf-h" style={{ fontSize: 13, marginBottom: 4 }}>Receita × alíquota efetiva</div>
          <div style={{ fontSize: 11, color: 'var(--ink-500)', marginBottom: 14 }}>Bolha = nº de filiais por linha</div>
          <div style={{ position: 'relative', height: 280, padding: '20px 30px 30px' }}>
            <svg width="100%" height="100%" viewBox="0 0 300 240" style={{ position: 'absolute', inset: 20 }}>
              {[0, 60, 120, 180, 240].map(y => (
                <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="var(--ink-100)" />
              ))}
              {sectors.map((s, i) => {
                const cx = (s.rev / 200) * 280 + 10;
                const cy = 240 - (s.cur / s.rev * 100 * 12);
                const r = 8 + i * 3;
                return (
                  <g key={s.name}>
                    <circle cx={cx} cy={cy} r={r} fill={s.color} fillOpacity="0.7" stroke={s.color} strokeWidth="1.5" />
                    <text x={cx + r + 4} y={cy + 3} fontSize="9" fill="var(--ink-700)">{s.name}</text>
                  </g>
                );
              })}
            </svg>
            <div style={{ position: 'absolute', left: 0, bottom: 6, fontSize: 10, color: 'var(--ink-400)', fontFamily: 'var(--font-mono)' }}>0M</div>
            <div style={{ position: 'absolute', right: 0, bottom: 6, fontSize: 10, color: 'var(--ink-400)', fontFamily: 'var(--font-mono)' }}>200M</div>
            <div style={{ position: 'absolute', bottom: -12, left: '50%', transform: 'translateX(-50%)', fontSize: 10, color: 'var(--ink-500)' }}>Receita anual (R$ M)</div>
          </div>
        </div>
      </div>

      {/* table */}
      <div className="wf-frame" style={{ background: 'var(--paper)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: 'var(--ink-50)' }}>
              {['Linha', 'Filiais', 'Receita', 'Alíq. atual', 'Alíq. reforma', 'Δ %'].map((h, i) => (
                <th key={h} style={{ padding: 12, textAlign: i === 0 ? 'left' : 'right', fontSize: 11, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sectors.map(s => (
              <tr key={s.name} style={{ borderTop: '1px solid var(--ink-100)' }}>
                <td style={{ padding: 12, fontWeight: 500 }}>{s.name}</td>
                <td style={{ padding: 12, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{Math.ceil(s.rev / 30)}</td>
                <td style={{ padding: 12, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>R$ {s.rev}M</td>
                <td style={{ padding: 12, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{(s.cur / s.rev * 100).toFixed(1)}%</td>
                <td style={{ padding: 12, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{(s.ref / s.rev * 100).toFixed(1)}%</td>
                <td style={{ padding: 12, textAlign: 'right' }}>
                  <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 3, fontSize: 11, fontWeight: 600, background: s.delta < 0 ? '#e6f4ee' : '#fde8e3', color: s.delta < 0 ? 'var(--kla-accent-down)' : 'var(--kla-accent-up)' }}>
                    {s.delta > 0 ? '+' : ''}{s.delta}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────── REGIONAL (filiais por UF) ───────────
const FILIAIS = [
  { uf: 'SP', n: 5, rev: 156, cur: 19.4, ref: 17.2, delta: -11 },
  { uf: 'RJ', n: 3, rev: 64,  cur: 7.8, ref: 6.9, delta: -11 },
  { uf: 'MG', n: 2, rev: 38,  cur: 4.1, ref: 4.3, delta: 5 },
  { uf: 'RS', n: 1, rev: 26,  cur: 3.8, ref: 3.6, delta: -5 },
  { uf: 'DF', n: 1, rev: 18,  cur: 3.2, ref: 3.4, delta: 6 },
  { uf: 'PR', n: 1, rev: 10,  cur: 2.6, ref: 2.4, delta: -8 },
];
function RegionalPage() {
  const totalRev = FILIAIS.reduce((s, f) => s + f.rev, 0);
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--ink-50)', minHeight: '100%' }}>
      <div>
        <div className="wf-label" style={{ marginBottom: 4 }}>Por Filial / UF</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, margin: 0, letterSpacing: '-0.02em' }}>
          Distribuição geográfica das suas filiais
        </h2>
        <p style={{ fontSize: 12, color: 'var(--ink-500)', margin: '4px 0 0' }}>
          13 filiais ativas em 6 UFs. O ICMS interestadual hoje é o tributo mais sensível à localização.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {/* Treemap por UF */}
        <div className="wf-frame" style={{ padding: 18, background: 'var(--paper)' }}>
          <div className="wf-h" style={{ fontSize: 13, marginBottom: 4 }}>Receita por UF</div>
          <div style={{ fontSize: 11, color: 'var(--ink-500)', marginBottom: 14 }}>Tamanho proporcional · cor pela variação pós-reforma</div>
          <div style={{ display: 'grid', gridTemplateColumns: '50% 25% 25%', gridTemplateRows: '60% 40%', gap: 4, height: 290 }}>
            {/* SP big */}
            <div style={{ gridColumn: '1', gridRow: '1 / span 2', background: 'var(--kla-primary)', color: 'white', padding: 14, borderRadius: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 11, opacity: 0.7, letterSpacing: '0.06em' }}>SÃO PAULO</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, lineHeight: 1, marginTop: 4, letterSpacing: '-0.02em' }}>SP</div>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>R$ 156 M</div>
                <div style={{ fontSize: 11, opacity: 0.85 }}>5 filiais · 50% da receita · −11%</div>
              </div>
            </div>
            {/* RJ */}
            <div style={{ background: 'var(--kla-primary-500)', color: 'white', padding: 12, borderRadius: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '-0.02em' }}>RJ</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>R$ 64 M</div>
                <div style={{ fontSize: 10, opacity: 0.85 }}>−11%</div>
              </div>
            </div>
            {/* MG */}
            <div style={{ background: '#c9532f', color: 'white', padding: 12, borderRadius: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '-0.02em' }}>MG</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>R$ 38 M</div>
                <div style={{ fontSize: 10, opacity: 0.85 }}>+5%</div>
              </div>
            </div>
            {/* RS, DF, PR */}
            {[
              { uf: 'RS', rev: 26, d: -5, color: 'var(--kla-primary-300)' },
              { uf: 'DF', rev: 18, d: 6, color: '#c9532f' },
              { uf: 'PR', rev: 10, d: -8, color: 'var(--kla-primary-300)' },
            ].map(t => (
              <div key={t.uf} style={{ background: t.color, color: 'white', padding: 10, borderRadius: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: '-0.02em' }}>{t.uf}</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600 }}>R$ {t.rev}M</div>
                  <div style={{ fontSize: 10, opacity: 0.85 }}>{t.d > 0 ? '+' : ''}{t.d}%</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 12, fontSize: 10, color: 'var(--ink-500)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, background: 'var(--kla-primary)', borderRadius: 2 }} /> Redução</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, background: '#c9532f', borderRadius: 2 }} /> Aumento</span>
          </div>
        </div>

        {/* horizontal bars per UF */}
        <div className="wf-frame" style={{ padding: 18, background: 'var(--paper)' }}>
          <div className="wf-h" style={{ fontSize: 13, marginBottom: 4 }}>Carga tributária por UF</div>
          <div style={{ fontSize: 11, color: 'var(--ink-500)', marginBottom: 18 }}>Alíquota efetiva atual (cinza) e pós-reforma (azul)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {FILIAIS.map(f => {
              const curRate = (f.cur / f.rev * 100);
              const refRate = (f.ref / f.rev * 100);
              return (
                <div key={f.uf} style={{ display: 'grid', gridTemplateColumns: '50px 1fr 80px', alignItems: 'center', gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, lineHeight: 1 }}>{f.uf}</div>
                    <div style={{ fontSize: 9, color: 'var(--ink-500)' }}>{f.n} {f.n === 1 ? 'filial' : 'filiais'}</div>
                  </div>
                  <div style={{ position: 'relative', height: 22 }}>
                    <div style={{ position: 'absolute', top: 2, left: 0, height: 8, width: `${(curRate / 18) * 100}%`, background: 'var(--ink-500)', borderRadius: 2 }} />
                    <div style={{ position: 'absolute', top: 12, left: 0, height: 8, width: `${(refRate / 18) * 100}%`, background: 'var(--kla-primary)', borderRadius: 2 }} />
                  </div>
                  <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                    <div>{curRate.toFixed(1)}%</div>
                    <div style={{ color: 'var(--kla-primary)' }}>{refRate.toFixed(1)}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* table */}
      <div className="wf-frame" style={{ background: 'var(--paper)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: 'var(--ink-50)' }}>
              {['UF', 'Filiais', 'Receita', '% receita', 'Imp. atual', 'Imp. reforma', 'Δ %'].map((h, i) => (
                <th key={h} style={{ padding: 12, textAlign: i < 1 ? 'left' : 'right', fontSize: 11, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FILIAIS.map(f => (
              <tr key={f.uf} style={{ borderTop: '1px solid var(--ink-100)' }}>
                <td style={{ padding: 12, fontWeight: 600 }}>{f.uf}</td>
                <td style={{ padding: 12, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{f.n}</td>
                <td style={{ padding: 12, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>R$ {f.rev} M</td>
                <td style={{ padding: 12, textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--ink-500)' }}>{((f.rev / totalRev) * 100).toFixed(0)}%</td>
                <td style={{ padding: 12, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>R$ {f.cur} M</td>
                <td style={{ padding: 12, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>R$ {f.ref} M</td>
                <td style={{ padding: 12, textAlign: 'right' }}>
                  <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 3, fontSize: 11, fontWeight: 600, background: f.delta < 0 ? '#e6f4ee' : '#fde8e3', color: f.delta < 0 ? 'var(--kla-accent-down)' : 'var(--kla-accent-up)' }}>
                    {f.delta > 0 ? '+' : ''}{f.delta}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────── TENDÊNCIAS 2026-2033 ───────────
function TrendsPage() {
  const milestones = [
    { y: 2026, t: 'Início', d: 'CBS vigente · IBS em teste (0,1%)', tone: 'info' },
    { y: 2027, t: 'CBS plena', d: 'Extinção de PIS/COFINS · IBS a 20%', tone: 'warn' },
    { y: 2029, t: 'Meio caminho', d: 'IBS a 50% · ICMS/ISS reduzidos à metade', tone: 'warn' },
    { y: 2033, t: 'Reforma completa', d: 'Extinção total de ICMS/ISS', tone: 'success' },
  ];
  const years = [2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033];
  const cur = [38.9, 40.8, 42.9, 45.0, 47.3, 49.6, 52.1, 54.7, 57.4];
  const ref = [38.9, 38.4, 36.2, 35.5, 35.0, 34.8, 34.7, 34.7, 34.7];
  const max = 60;
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--ink-50)', minHeight: '100%' }}>
      <div>
        <div className="wf-label" style={{ marginBottom: 4 }}>Tendências e Projeções</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, margin: 0, letterSpacing: '-0.02em' }}>
          Sua carga tributária ao longo da transição 2025 → 2033
        </h2>
      </div>

      {/* Milestones strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {milestones.map(m => {
          const colors = { info: 'var(--kla-primary)', warn: 'var(--kla-accent-warn)', success: 'var(--kla-accent-down)' };
          return (
            <div key={m.y} className="wf-frame" style={{ padding: 14, background: 'var(--paper)', borderLeft: `3px solid ${colors[m.tone]}` }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: colors[m.tone], fontWeight: 700 }}>{m.y}</div>
              <div style={{ fontSize: 13, fontWeight: 600, margin: '2px 0 4px' }}>{m.t}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-500)', lineHeight: 1.4 }}>{m.d}</div>
            </div>
          );
        })}
      </div>

      {/* Big chart */}
      <div className="wf-frame" style={{ padding: 20, background: 'var(--paper)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div className="wf-h" style={{ fontSize: 13 }}>Projeção da carga tributária total</div>
            <div style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 2 }}>R$ Milhões/ano · linha tracejada = sem reforma · sólida = transição real</div>
          </div>
          <div style={{ display: 'flex', gap: 4, background: 'var(--ink-100)', padding: 3, borderRadius: 6 }}>
            <span style={{ padding: '4px 10px', background: 'var(--paper)', borderRadius: 4, fontSize: 11, fontWeight: 600, boxShadow: 'var(--shadow-sm)' }}>Área</span>
            <span style={{ padding: '4px 10px', fontSize: 11, color: 'var(--ink-500)' }}>Linha</span>
            <span style={{ padding: '4px 10px', fontSize: 11, color: 'var(--ink-500)' }}>Barra</span>
          </div>
        </div>
        <div style={{ position: 'relative', height: 280, padding: '4px 0 24px' }}>
          <svg width="100%" height="100%" viewBox="0 0 800 250" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
            {[0, 50, 100, 150, 200, 250].map(y => (
              <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="var(--ink-100)" />
            ))}
            {/* milestone vertical lines */}
            {[2027, 2029, 2033].map(y => {
              const x = ((y - 2025) / 8) * 800;
              return <line key={y} x1={x} y1="0" x2={x} y2="250" stroke="var(--kla-accent-warn)" strokeOpacity="0.3" strokeDasharray="3 3" />;
            })}
            <polyline fill="none" stroke="var(--ink-500)" strokeWidth="2" strokeDasharray="6 4"
              points={cur.map((v, i) => `${(i / 8) * 800},${250 - (v / max) * 230}`).join(' ')} />
            <polygon fill="var(--kla-primary)" fillOpacity="0.15"
              points={`0,250 ${ref.map((v, i) => `${(i / 8) * 800},${250 - (v / max) * 230}`).join(' ')} 800,250`} />
            <polyline fill="none" stroke="var(--kla-primary)" strokeWidth="2.5"
              points={ref.map((v, i) => `${(i / 8) * 800},${250 - (v / max) * 230}`).join(' ')} />
            {ref.map((v, i) => (
              <circle key={i} cx={(i / 8) * 800} cy={250 - (v / max) * 230} r="3" fill="var(--kla-primary)" />
            ))}
          </svg>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>
            {years.map(y => <span key={y}>{y}</span>)}
          </div>
        </div>
      </div>

      {/* impacto acumulado callout */}
      <div className="wf-frame wf-frame--brand" style={{ padding: 18, background: 'var(--paper)', borderLeft: '4px solid var(--kla-primary)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, alignItems: 'center' }}>
        <div>
          <div className="wf-label">Economia acumulada 2025-2033</div>
          <div className="wf-num" style={{ fontSize: 32, color: 'var(--kla-accent-down)' }}>R$ 84,3 M</div>
        </div>
        <div>
          <div className="wf-label">Carga 2033 vs 2025</div>
          <div className="wf-num" style={{ fontSize: 32 }}>−10,8%</div>
        </div>
        <div>
          <div className="wf-label">Ano de breakeven</div>
          <div className="wf-num" style={{ fontSize: 32 }}>2027</div>
        </div>
      </div>
    </div>
  );
}

// ─────────── DADOS BRUTOS ───────────
function RawDataPage() {
  const cols = ['Filial', 'UF', 'Receita', 'IRPJ', 'CSLL', 'PIS', 'COFINS', 'ICMS', 'Atual', 'CBS', 'IBS', 'Reforma', 'Δ%'];
  const rows = [
    ['SP — Pinheiros',  'SP', 32.4, 1.1, 0.4, 1.3, 2.8, 4.2, 9.8, 2.4, 5.5, 7.9, -19],
    ['SP — Morumbi',    'SP', 24.0, 0.8, 0.4, 0.9, 2.0, 3.1, 7.2, 1.8, 4.0, 5.8, -19],
    ['SP — Ipiranga',   'SP', 18.6, 0.7, 0.3, 0.8, 1.6, 2.3, 5.7, 1.4, 3.1, 4.5, -21],
    ['SP — Tatuapé',    'SP', 12.0, 0.5, 0.2, 0.5, 1.0, 1.5, 3.7, 0.9, 2.0, 2.9, -22],
    ['RJ — Barra',      'RJ', 21.3, 0.7, 0.3, 0.8, 1.7, 2.7, 6.2, 1.6, 3.7, 5.3, -15],
    ['RJ — Ipanema',    'RJ', 14.0, 0.5, 0.2, 0.5, 1.1, 1.7, 4.0, 1.0, 2.4, 3.4, -15],
    ['RJ — Niterói',    'RJ', 9.4,  0.3, 0.1, 0.3, 0.7, 1.1, 2.5, 0.7, 1.6, 2.3, -8],
    ['MG — Savassi',    'MG', 14.2, 0.5, 0.2, 0.5, 1.0, 1.6, 4.1, 1.1, 2.6, 3.7, -10],
    ['MG — Belvedere',  'MG', 8.8,  0.3, 0.2, 0.3, 0.6, 0.9, 2.5, 0.7, 1.6, 2.3, -8],
    ['DF — Asa Sul',    'DF', 11.5, 0.4, 0.2, 0.4, 0.7, 0.0, 3.2, 0.9, 2.5, 3.4, 6],
  ];
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--ink-50)', minHeight: '100%' }}>
      <div>
        <div className="wf-label" style={{ marginBottom: 4 }}>Dados Brutos</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, margin: 0, letterSpacing: '-0.02em' }}>
          Toda a base — 13 filiais · 22 colunas · exportável
        </h2>
      </div>

      {/* toolbar */}
      <div className="wf-frame" style={{ padding: 12, background: 'var(--paper)', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--ink-50)', border: '1px solid var(--ink-200)', padding: '6px 12px', borderRadius: 6, width: 280, color: 'var(--ink-400)', fontSize: 12 }}>
          <Icon d={ICONS.search} size={14} />
          <span>Buscar filial, UF, NCM…</span>
        </div>
        <span className="wf-pill"><Icon d={ICONS.filter} size={12} /> Filiais (13)</span>
        <span className="wf-pill">UFs (6)</span>
        <span className="wf-pill">Colunas (13/22)</span>
        <div style={{ flex: 1 }} />
        <button style={{ padding: '7px 12px', fontSize: 12, background: 'var(--kla-primary)', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', gap: 6, alignItems: 'center', fontWeight: 600 }}>
          <Icon d={ICONS.download} size={12} /> Exportar CSV
        </button>
      </div>

      {/* table */}
      <div className="wf-frame" style={{ background: 'var(--paper)', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr style={{ background: 'var(--ink-50)' }}>
              {cols.map((c, i) => (
                <th key={c} style={{
                  padding: '10px 8px', textAlign: i < 2 ? 'left' : 'right',
                  fontSize: 10, color: 'var(--ink-500)', textTransform: 'uppercase',
                  letterSpacing: '0.04em', fontWeight: 600, whiteSpace: 'nowrap',
                  borderBottom: '1px solid var(--ink-200)', position: 'sticky', top: 0, background: 'var(--ink-50)',
                }}>{c} {i >= 2 && <span style={{ color: 'var(--ink-300)', marginLeft: 2 }}>↕</span>}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} style={{ borderTop: '1px solid var(--ink-100)' }}>
                {r.map((cell, ci) => (
                  <td key={ci} style={{
                    padding: '8px', textAlign: ci < 2 ? 'left' : 'right',
                    fontFamily: ci < 2 ? 'var(--font-sans)' : 'var(--font-mono)',
                    fontWeight: ci === 0 ? 500 : 400,
                    color: ci === cols.length - 1 ? (cell < 0 ? 'var(--kla-accent-down)' : 'var(--kla-accent-up)') : 'var(--ink-700)',
                  }}>
                    {ci === cols.length - 1 ? `${cell > 0 ? '+' : ''}${cell}%` : cell}
                  </td>
                ))}
              </tr>
            ))}
            <tr style={{ background: 'var(--ink-50)', fontWeight: 700 }}>
              <td colSpan="2" style={{ padding: 12 }}>Totais (10 de 13)</td>
              <td style={{ padding: 12, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>R$ 166,2 M</td>
              <td colSpan="5" />
              <td style={{ padding: 12, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>R$ 48,9 M</td>
              <td colSpan="2" />
              <td style={{ padding: 12, textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--kla-primary)' }}>R$ 41,5 M</td>
              <td style={{ padding: 12, textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--kla-accent-down)' }}>−15%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

window.LoginPage = LoginPage;
window.SectorPage = SectorPage;
window.RegionalPage = RegionalPage;
window.TrendsPage = TrendsPage;
window.RawDataPage = RawDataPage;
