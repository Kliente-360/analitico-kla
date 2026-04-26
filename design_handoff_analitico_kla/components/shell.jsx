/* global React */
// Shell — sidebar + topbar com empresa logada (single-tenant)

const Icon = ({ d, size = 16, stroke = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ICONS = {
  dash: "M3 12l9-9 9 9M5 10v10h14V10",
  pivot: "M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18",
  sim: "M4 17l4-8 4 4 4-10 4 14M4 21h16",
  sector: "M12 3v9l8 4M12 3a9 9 0 1 0 8 13",
  region: "M12 21s-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12zM12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  trend: "M3 17l6-6 4 4 8-8M14 7h7v7",
  raw: "M4 4h16v4H4zM4 10h16v4H4zM4 16h16v4H4z",
  search: "M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16zM21 21l-4.35-4.35",
  bell: "M18 16v-5a6 6 0 1 0-12 0v5l-2 3h16zM10 19a2 2 0 0 0 4 0",
  download: "M12 3v12m0 0l-4-4m4 4l4-4M4 21h16",
  caret: "M6 9l6 6 6-6",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  filter: "M3 4h18l-7 9v7l-4-2v-5z",
};

const NAV = [
  { id: "dash", label: "Visão Executiva", icon: ICONS.dash, active: true },
  { id: "pivot", label: "Análise Multidimensional", icon: ICONS.pivot },
  { id: "sim", label: "Simulação de Cenários", icon: ICONS.sim, badge: "novo" },
  { id: "sector", label: "Por Linha de Negócio", icon: ICONS.sector, dim: true },
  { id: "region", label: "Por Filial / UF", icon: ICONS.region, dim: true },
  { id: "trend", label: "Tendência 2026–2033", icon: ICONS.trend, dim: true },
  { id: "raw", label: "Dados Brutos", icon: ICONS.raw, dim: true },
];

function KlaLogo({ size = 22 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="14" fill="var(--kla-primary)" />
        <circle cx="16" cy="16" r="8" fill="none" stroke="white" strokeWidth="2" />
        <circle cx="22" cy="10" r="2.5" fill="white" />
      </svg>
      <div style={{ lineHeight: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: '-0.01em', color: 'var(--ink-900)' }}>
          Kliente <span style={{ color: 'var(--kla-primary)' }}>360</span>
        </div>
        <div style={{ fontSize: 9, color: 'var(--ink-500)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2 }}>
          Analítico KLA
        </div>
      </div>
    </div>
  );
}

function Sidebar({ collapsed }) {
  return (
    <aside style={{
      width: collapsed ? 56 : 224,
      background: 'var(--paper)',
      borderRight: '1px solid var(--ink-200)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      <div style={{ padding: collapsed ? '16px 12px' : '18px 18px', borderBottom: '1px solid var(--ink-100)' }}>
        {collapsed ? <KlaLogo size={20} /> : <KlaLogo />}
      </div>

      <nav style={{ padding: '12px 8px', flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {!collapsed && (
          <div className="wf-label" style={{ padding: '8px 10px 4px' }}>Análise</div>
        )}
        {NAV.map(n => (
          <div key={n.id} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: collapsed ? '10px' : '8px 10px',
            borderRadius: 6,
            background: n.active ? 'var(--kla-primary-100)' : 'transparent',
            color: n.active ? 'var(--kla-primary-600)' : (n.dim ? 'var(--ink-400)' : 'var(--ink-700)'),
            fontSize: 13,
            fontWeight: n.active ? 600 : 500,
            cursor: 'pointer',
            justifyContent: collapsed ? 'center' : 'flex-start',
            position: 'relative',
          }}>
            {n.active && !collapsed && (
              <span style={{
                position: 'absolute', left: -8, top: 6, bottom: 6, width: 3,
                background: 'var(--kla-primary)', borderRadius: 2,
              }} />
            )}
            <Icon d={n.icon} />
            {!collapsed && <span style={{ flex: 1 }}>{n.label}</span>}
            {!collapsed && n.badge && (
              <span style={{
                fontSize: 9, padding: '2px 6px', background: 'var(--kla-accent-warn)',
                color: 'white', borderRadius: 3, letterSpacing: '0.05em', textTransform: 'uppercase'
              }}>{n.badge}</span>
            )}
          </div>
        ))}
      </nav>

      {!collapsed && (
        <div style={{ padding: 12, borderTop: '1px solid var(--ink-100)' }}>
          <div className="wf-frame" style={{ padding: 10, background: 'var(--ink-50)' }}>
            <div className="wf-label" style={{ marginBottom: 4 }}>Dúvidas tributárias?</div>
            <div style={{ fontSize: 11, color: 'var(--ink-700)', lineHeight: 1.4, marginBottom: 8 }}>
              Fale com seu consultor Kliente 360
            </div>
            <div style={{ fontSize: 11, color: 'var(--kla-primary)', fontWeight: 600 }}>
              Abrir chat →
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

function Topbar({ company = "Bodytech Company S.A." }) {
  return (
    <header style={{
      height: 56,
      background: 'var(--paper)',
      borderBottom: '1px solid var(--ink-200)',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '0 20px',
      flexShrink: 0,
    }}>
      {/* Empresa logada — protagonista */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 6,
          background: 'var(--kla-primary)', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 13, letterSpacing: '-0.02em',
        }}>BT</div>
        <div style={{ lineHeight: 1.2 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-900)' }}>{company}</div>
          <div style={{ fontSize: 11, color: 'var(--ink-500)' }}>CNPJ 12.345.678/0001-99 · Dados Jan–Dez 2025</div>
        </div>
        <div style={{ color: 'var(--ink-400)', marginLeft: 4 }}>
          <Icon d={ICONS.caret} size={14} />
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Period selector */}
      <div className="wf-pill">
        <span style={{ color: 'var(--ink-500)' }}>Período:</span>
        <strong style={{ color: 'var(--ink-900)' }}>Ano fiscal 2025</strong>
        <Icon d={ICONS.caret} size={12} />
      </div>

      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'var(--ink-50)', border: '1px solid var(--ink-200)',
        padding: '6px 12px', borderRadius: 6, width: 220,
        color: 'var(--ink-400)', fontSize: 12,
      }}>
        <Icon d={ICONS.search} size={14} />
        <span>Buscar tributo, filial, NCM…</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, fontFamily: 'var(--font-mono)', border: '1px solid var(--ink-200)', padding: '0 4px', borderRadius: 3 }}>⌘K</span>
      </div>

      <button style={{
        padding: '6px 8px', background: 'transparent', border: 'none',
        color: 'var(--ink-500)', cursor: 'pointer', position: 'relative',
      }}>
        <Icon d={ICONS.bell} size={18} />
        <span style={{ position: 'absolute', top: 4, right: 6, width: 6, height: 6, background: 'var(--kla-accent-up)', borderRadius: 3 }} />
      </button>

      <button style={{
        padding: '7px 12px', background: 'var(--kla-primary)', color: 'white',
        border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600,
        display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
      }}>
        <Icon d={ICONS.download} size={14} />
        Exportar relatório
      </button>

      <div style={{
        width: 32, height: 32, borderRadius: 16,
        background: 'var(--ink-200)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 600, color: 'var(--ink-700)',
      }}>BA</div>
    </header>
  );
}

window.Icon = Icon;
window.ICONS = ICONS;
window.Sidebar = Sidebar;
window.Topbar = Topbar;
window.KlaLogo = KlaLogo;
