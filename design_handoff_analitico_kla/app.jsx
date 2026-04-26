/* global React, useTweaks, TweaksPanel, TweakSection, TweakColor, TweakToggle */
// App principal — design canvas com todos os artboards

function PageWithChrome({ children, w = 1280 }) {
  return (
    <div style={{ width: w, height: 820, display: 'flex', background: 'var(--paper)', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar />
        <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
      </div>
    </div>
  );
}

function PlanCard() {
  return (
    <div style={{
      width: 720, padding: 32, background: 'var(--paper)', borderRadius: 12,
      border: '1px solid var(--ink-200)', boxShadow: 'var(--shadow-md)',
      fontFamily: 'var(--font-sans)', color: 'var(--ink-900)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <KlaLogo size={28} />
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-500)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          v0.1 · Wireframes médios
        </span>
      </div>

      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, letterSpacing: '-0.02em', margin: '0 0 6px' }}>
        Redesign Analítico KLA
      </h1>
      <p style={{ color: 'var(--ink-500)', fontSize: 14, margin: '0 0 20px', lineHeight: 1.5, textWrap: 'pretty' }}>
        Plano de design para a aplicação <strong>single-tenant</strong> de inteligência tributária —
        cada cliente final analisa <em>seus próprios dados</em> sob a Reforma.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 22 }}>
        <div>
          <div className="wf-label" style={{ marginBottom: 8 }}>Premissa que reorienta o produto</div>
          <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--ink-700)', margin: 0 }}>
            Você esclareceu que <strong>uma única empresa</strong> usa o portal por sessão. O design original
            tratava "carteira de clientes" como protagonista — invertemos isso. O protagonista agora é a empresa
            logada, e cada visualização responde a perguntas pessoais: <em>quanto a minha operação paga hoje?
            quanto pagaria no novo regime? qual filial sofre mais?</em>
          </p>
        </div>
        <div>
          <div className="wf-label" style={{ marginBottom: 8 }}>Direção visual</div>
          <ul style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--ink-700)', margin: 0, paddingLeft: 16 }}>
            <li>Vermelho cliente <strong>#E30613</strong> — usado com parcimônia (ações, ênfase, indicadores)</li>
            <li>Carvão institucional <strong>#1A1D24</strong> em áreas grandes (hero login, cabeçalhos)</li>
            <li>Type: Inter (UI) + Fraunces (números executivos)</li>
            <li>Modo claro/escuro + cor primária ajustável (Tweaks)</li>
          </ul>
        </div>
      </div>

      <div className="wf-divider" style={{ margin: '4px 0 22px' }} />

      <div className="wf-label" style={{ marginBottom: 12 }}>Telas nesta primeira leva</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, fontSize: 13, marginBottom: 22 }}>
        {[
          { n: '01', t: 'Shell + Login', d: 'Sidebar fixa · topbar com empresa logada · busca global ⌘K' },
          { n: '02', t: 'Visão Executiva', d: 'Hero narrativo + KPIs + composição + por filial + projeção 2033' },
          { n: '03', t: 'Análise Multidim.', d: 'Pivot drag-and-drop · heatmap · insights automáticos' },
          { n: '04', t: 'Simulação A/B', d: 'Sliders CBS/IBS · 4 regimes lado a lado · impacto por filial' },
          { n: '05', t: 'Mobile · Visão', d: 'Adaptação responsiva — mesmo conteúdo, navegação por tabs' },
          { n: '06', t: 'Variações', d: 'Tweaks: cor primária + claro/escuro' },
        ].map(s => (
          <div key={s.n} style={{ padding: 12, background: 'var(--ink-50)', borderRadius: 6, border: '1px solid var(--ink-200)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--kla-primary)', fontWeight: 700 }}>{s.n}</div>
            <div style={{ fontWeight: 600, fontSize: 13, margin: '2px 0 4px' }}>{s.t}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-500)', lineHeight: 1.4 }}>{s.d}</div>
          </div>
        ))}
      </div>

      <div className="wf-label" style={{ marginBottom: 12 }}>Diferenciais propostos</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: 'var(--ink-700)', marginBottom: 22 }}>
        <div>
          <strong>Hero narrativo no dashboard.</strong> Em vez de só números, o topo conta uma frase clara —
          "<em>A Bodytech vai pagar R$ 4,2 M a menos…</em>" — o gestor entende o impacto em 3 segundos.
        </div>
        <div>
          <strong>Insights automáticos no Pivot.</strong> Cards acima da tabela destacam o maior contribuinte,
          tributo dominante e qualquer anomalia detectada — antes do usuário precisar olhar.
        </div>
        <div>
          <strong>Comparação A/B nativa na Simulação.</strong> Dois cenários lado a lado, com gráfico de 4 barras
          (Atual · Oficial · A · B) e tabela de impacto por filial.
        </div>
      </div>

      <div className="wf-note" style={{ fontFamily: 'var(--font-sketch)', fontSize: 16, padding: '10px 14px', display: 'inline-block' }}>
        Próximos passos · após sua aprovação: arrumamos as telas faltantes (Setor, Regional, Tendências,
        Dados Brutos, Login) e subimos a fidelidade para hi-fi pronta para implementar.
      </div>
    </div>
  );
}

function App() {
  const tweaks = useTweaks(window.TWEAK_DEFAULTS || { primary: '#e30613', dark: false });

  // aplica tweaks ao documento
  React.useEffect(() => {
    const el = document.documentElement;
    el.style.setProperty('--kla-primary', tweaks.primary);
    el.style.setProperty('--kla-primary-100', tweaks.primary + '1f');
    el.style.setProperty('--kla-primary-300', tweaks.primary + '88');
    el.style.setProperty('--kla-primary-500', tweaks.primary);
    el.style.setProperty('--kla-primary-600', tweaks.primary);
    el.setAttribute('data-theme', tweaks.dark ? 'dark' : 'light');
  }, [tweaks.primary, tweaks.dark]);

  return (
    <>
      <DesignCanvas>
        <DCSection id="plano" title="Plano · Direção" subtitle="Leia primeiro — premissa, escopo e direção visual">
          <DCArtboard id="plano" label="Plano" width={720} height={760}>
            <PlanCard />
          </DCArtboard>
        </DCSection>

        <DCSection id="dashboard" title="01 · Visão Executiva" subtitle="Tela primária · onde o gestor entra todo dia">
          <DCArtboard id="dashboard-desktop" label="Desktop · 1280px" width={1280} height={820}>
            <PageWithChrome><DashboardExec /></PageWithChrome>
          </DCArtboard>
          <DCArtboard id="dashboard-mobile" label="Mobile · 360px" width={360} height={720}>
            <MobileDashboard />
          </DCArtboard>
        </DCSection>

        <DCSection id="pivot" title="02 · Análise Multidimensional" subtitle="Pivot drag-and-drop · cruze qualquer dimensão dos seus dados">
          <DCArtboard id="pivot-desktop" label="Desktop · 1280px" width={1280} height={820}>
            <PageWithChrome><PivotPage /></PageWithChrome>
          </DCArtboard>
        </DCSection>

        <DCSection id="simulacao" title="03 · Simulação A/B" subtitle="Sliders CBS/IBS · dois cenários lado a lado">
          <DCArtboard id="sim-desktop" label="Desktop · 1280px" width={1280} height={820}>
            <PageWithChrome><SimulationPage /></PageWithChrome>
          </DCArtboard>
        </DCSection>

        <DCSection id="login" title="00 · Login" subtitle="Porta de entrada · split brand + form">
          <DCArtboard id="login-desktop" label="Desktop · 1280px" width={1280} height={820}>
            <LoginPage />
          </DCArtboard>
        </DCSection>

        <DCSection id="setor" title="04 · Por Linha de Negócio" subtitle="Como cada linha de negócio reage à reforma">
          <DCArtboard id="setor-desktop" label="Desktop · 1280px" width={1280} height={820}>
            <PageWithChrome><SectorPage /></PageWithChrome>
          </DCArtboard>
        </DCSection>

        <DCSection id="regional" title="05 · Por Filial / UF" subtitle="Distribuição geográfica das suas filiais">
          <DCArtboard id="regional-desktop" label="Desktop · 1280px" width={1280} height={820}>
            <PageWithChrome><RegionalPage /></PageWithChrome>
          </DCArtboard>
        </DCSection>

        <DCSection id="tendencias" title="06 · Tendências 2026-2033" subtitle="Calendário oficial da reforma · projeção da carga">
          <DCArtboard id="trends-desktop" label="Desktop · 1280px" width={1280} height={820}>
            <PageWithChrome><TrendsPage /></PageWithChrome>
          </DCArtboard>
        </DCSection>

        <DCSection id="raw" title="07 · Dados Brutos" subtitle="Toda a base · filtros · exportação CSV">
          <DCArtboard id="raw-desktop" label="Desktop · 1280px" width={1280} height={820}>
            <PageWithChrome><RawDataPage /></PageWithChrome>
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Brand">
          <TweakColor label="Cor primária" value={tweaks.primary} onChange={v => tweaks.set('primary', v)} />
        </TweakSection>
        <TweakSection title="Tema">
          <TweakToggle label="Modo escuro" value={tweaks.dark} onChange={v => tweaks.set('dark', v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
