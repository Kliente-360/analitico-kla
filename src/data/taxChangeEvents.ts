import type { AppNotification } from '../store/notificationStore'

export const INITIAL_NOTIFICATIONS: Omit<AppNotification, 'id' | 'timestamp' | 'read'>[] = [
  {
    type: 'tax-change',
    title: 'CBS: alíquota confirmada em 8,8%',
    body: 'Receita Federal confirmou a alíquota CBS de 8,8% para 2026. Atualização automática nos cenários.',
  },
  {
    type: 'tax-change',
    title: 'IBS Serviços: redução de 5,8% para 5,0%',
    body: 'Proposta de redução da alíquota IBS para serviços aprovada em 1ª leitura no Senado.',
  },
  {
    type: 'info',
    title: 'Cronograma da reforma tributária atualizado',
    body: 'Período de transição confirmado: 2026-2033. ICMS e ISS extintos progressivamente.',
  },
  {
    type: 'warning',
    title: 'Imposto Seletivo: 3 novos setores incluídos',
    body: 'Bebidas alcoólicas, tabaco e veículos de luxo incluídos no Imposto Seletivo.',
  },
]
