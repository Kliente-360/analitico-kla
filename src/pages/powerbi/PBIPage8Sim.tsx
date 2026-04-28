import { useState, useMemo } from 'react'
import { DIM_ALIQUOTAS } from '../../data/powerbi/dimensions'

interface SimInputs {
  preco: number
  ano: number
  aliqISS: number
  aliqPIS: number
  aliqCOFINS: number
  retISS: number
  retCSRF: number
  retIRRF: number
  retINSS: number
  tipoCalculo: 'Por Dentro' | 'Por Fora'
}

const TIPO_OPCOES = ['Por Dentro', 'Por Fora'] as const

function SliderRow({
  label, value, min, max, step, unit,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit?: string
  onChange: (v: number) => void
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex justify-between text-[11px]">
        <span className="text-ink-600 font-medium">{label}</span>
        <span className="text-primary-700 font-bold tabular-nums">
          {value.toFixed(step < 1 ? 2 : 0)}{unit ?? ''}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full accent-primary-600"
      />
    </div>
  )
}

function ResultCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-ink-100 px-4 py-3">
      <p className="text-[11px] text-ink-400 uppercase tracking-wide">{label}</p>
      <p className="text-xl font-bold text-ink-900 mt-0.5">{value}</p>
      {sub && <p className="text-[11px] text-ink-400 mt-0.5">{sub}</p>}
    </div>
  )
}

const fmtR = (v: number) =>
  `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const fmtPct = (v: number) => `${v.toFixed(2)}%`

export default function PBIPage8Sim(): React.ReactElement {
  const [inputs, setInputs] = useState<SimInputs>({
    preco: 10000,
    ano: 2027,
    aliqISS: 5,
    aliqPIS: 0.65,
    aliqCOFINS: 3,
    retISS: 2,
    retCSRF: 1,
    retIRRF: 1.5,
    retINSS: 11,
    tipoCalculo: 'Por Fora',
  })

  const set = <K extends keyof SimInputs>(k: K, v: SimInputs[K]) =>
    setInputs((prev) => ({ ...prev, [k]: v }))

  const dim = useMemo(() =>
    DIM_ALIQUOTAS.find((d) => d.ano === inputs.ano) ?? DIM_ALIQUOTAS[0],
    [inputs.ano]
  )

  const calc = useMemo(() => {
    const { preco, aliqISS, aliqPIS, aliqCOFINS, retISS, retCSRF, retIRRF, retINSS, tipoCalculo } = inputs

    // Reform taxes
    const ibsPct = dim.aliquota_ibs * 100
    const cbsPct = dim.aliquota_cbs * 100
    const issPct = aliqISS * (1 - dim.reducao_iss)
    const pisAtivo = aliqPIS * dim.reducao_ibs
    const cofinsAtivo = aliqCOFINS * dim.reducao_ibs

    const totalAliqTrib = issPct + pisAtivo + cofinsAtivo + ibsPct + cbsPct

    // Base calculation
    const base = tipoCalculo === 'Por Dentro'
      ? preco / (1 + totalAliqTrib / 100)
      : preco

    const tribISS    = base * issPct / 100
    const tribPIS    = base * pisAtivo / 100
    const tribCOFINS = base * cofinsAtivo / 100
    const tribIBS    = base * ibsPct / 100
    const tribCBS    = base * cbsPct / 100
    const totalTrib  = tribISS + tribPIS + tribCOFINS + tribIBS + tribCBS

    // Retenções (calculadas sobre base antes dos tributos)
    const retISSv  = base * retISS / 100
    const retCSRFv = base * retCSRF / 100
    const retIRRFv = base * retIRRF / 100
    const retINSSv = base * retINSS / 100
    const totalRet = retISSv + retCSRFv + retIRRFv + retINSSv

    const valorServico = base
    const precoLiquido = base - totalTrib
    const totalServico = tipoCalculo === 'Por Dentro' ? preco : base + totalTrib
    const totalTributos = totalTrib + totalRet

    return {
      base,
      tribISS, tribPIS, tribCOFINS, tribIBS, tribCBS,
      totalTrib, issPct, pisAtivo, cofinsAtivo, ibsPct, cbsPct,
      retISSv, retCSRFv, retIRRFv, retINSSv, totalRet,
      valorServico, precoLiquido, totalServico, totalTributos,
    }
  }, [inputs, dim])

  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:gap-6">
      {/* Left panel: sliders */}
      <div className="lg:w-72 flex-shrink-0">
        <div className="bg-white rounded-xl shadow-sm border border-ink-100 p-4 flex flex-col gap-4">
          <p className="text-xs font-bold text-ink-700 uppercase tracking-wide">Parâmetros</p>

          <SliderRow
            label="Preço do Serviço (R$)"
            value={inputs.preco} min={0} max={10000} step={0.10} unit=""
            onChange={(v) => set('preco', v)}
          />

          <div className="flex flex-col gap-0.5">
            <label className="text-[11px] text-ink-600 font-medium">Ano da Simulação</label>
            <select
              value={inputs.ano}
              onChange={(e) => set('ano', parseInt(e.target.value))}
              className="text-xs border border-ink-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-400"
            >
              {DIM_ALIQUOTAS.filter((d) => d.ano >= 2026 || d.ano === 2024).map((d) => (
                <option key={d.ano} value={d.ano}>{d.ano}</option>
              ))}
            </select>
          </div>

          <div className="border-t border-ink-100 pt-3">
            <p className="text-[10px] font-semibold text-ink-400 uppercase mb-2">Alíquotas de Incidência</p>
            <div className="flex flex-col gap-3">
              <SliderRow label="ISS (%)"     value={inputs.aliqISS}    min={0} max={10}  step={0.5} unit="%" onChange={(v) => set('aliqISS', v)} />
              <SliderRow label="PIS (%)"     value={inputs.aliqPIS}    min={0} max={5}   step={0.1} unit="%" onChange={(v) => set('aliqPIS', v)} />
              <SliderRow label="COFINS (%)"  value={inputs.aliqCOFINS} min={0} max={10}  step={0.5} unit="%" onChange={(v) => set('aliqCOFINS', v)} />
            </div>
          </div>

          <div className="border-t border-ink-100 pt-3">
            <p className="text-[10px] font-semibold text-ink-400 uppercase mb-2">Retenções</p>
            <div className="flex flex-col gap-3">
              <SliderRow label="Ret. ISS (%)"  value={inputs.retISS}  min={0} max={5}   step={0.5} unit="%" onChange={(v) => set('retISS', v)} />
              <SliderRow label="CSRF (%)"       value={inputs.retCSRF} min={0} max={5}   step={0.1} unit="%" onChange={(v) => set('retCSRF', v)} />
              <SliderRow label="IRRF (%)"       value={inputs.retIRRF} min={0} max={10}  step={0.5} unit="%" onChange={(v) => set('retIRRF', v)} />
              <SliderRow label="INSS (%)"       value={inputs.retINSS} min={0} max={20}  step={1}   unit="%" onChange={(v) => set('retINSS', v)} />
            </div>
          </div>

          <div className="border-t border-ink-100 pt-3">
            <p className="text-[10px] font-semibold text-ink-400 uppercase mb-1.5">Tipo de Cálculo</p>
            <div className="flex gap-2">
              {TIPO_OPCOES.map((op) => (
                <button
                  key={op}
                  onClick={() => set('tipoCalculo', op)}
                  className={`flex-1 text-xs py-1.5 rounded border transition-colors ${
                    inputs.tipoCalculo === op
                      ? 'bg-primary-700 text-white border-primary-700'
                      : 'text-ink-600 border-ink-200 hover:border-primary-300'
                  }`}
                >
                  {op}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel: results */}
      <div className="flex-1 flex flex-col gap-4">
        {/* 4 KPI cards */}
        <div className="grid grid-cols-2 gap-3">
          <ResultCard
            label="Valor do Serviço"
            value={fmtR(calc.valorServico)}
            sub={`Base de cálculo (${inputs.tipoCalculo})`}
          />
          <ResultCard
            label="Preço Líquido"
            value={fmtR(calc.precoLiquido)}
            sub="Após dedução de tributos"
          />
          <ResultCard
            label="Total do Serviço"
            value={fmtR(calc.totalServico)}
            sub={`Valor${inputs.tipoCalculo === 'Por Dentro' ? ' = base' : ' com tributos'}`}
          />
          <ResultCard
            label="Total de Tributos"
            value={fmtR(calc.totalTributos)}
            sub={`${calc.valorServico > 0 ? ((calc.totalTributos / calc.valorServico) * 100).toFixed(1) : '0'}% do serviço`}
          />
        </div>

        {/* Tributos table */}
        <div className="bg-white rounded-xl shadow-sm border border-ink-100 overflow-hidden">
          <p className="text-xs font-semibold text-ink-700 px-4 pt-3 pb-2">Tributos por Categoria</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-ink-50 border-b border-ink-100 text-ink-500">
                <th className="px-4 py-1.5 text-left">Tributo</th>
                <th className="px-4 py-1.5 text-right">Alíquota Efetiva</th>
                <th className="px-4 py-1.5 text-right">Base de Cálculo</th>
                <th className="px-4 py-1.5 text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'ISS',            aliq: calc.issPct,     val: calc.tribISS,    color: 'text-amber-700' },
                { name: 'PIS',            aliq: calc.pisAtivo,   val: calc.tribPIS,    color: 'text-green-700' },
                { name: 'COFINS',         aliq: calc.cofinsAtivo,val: calc.tribCOFINS, color: 'text-green-700' },
                { name: 'IBS',            aliq: calc.ibsPct,     val: calc.tribIBS,    color: 'text-orange-700' },
                { name: 'CBS',            aliq: calc.cbsPct,     val: calc.tribCBS,    color: 'text-red-700' },
              ].map((row) => (
                <tr key={row.name} className="border-b border-ink-50 hover:bg-ink-50/50">
                  <td className={`px-4 py-1.5 font-medium ${row.color}`}>{row.name}</td>
                  <td className="px-4 py-1.5 text-right text-ink-600">{fmtPct(row.aliq)}</td>
                  <td className="px-4 py-1.5 text-right text-ink-500">{fmtR(calc.base)}</td>
                  <td className={`px-4 py-1.5 text-right font-semibold ${row.color}`}>{fmtR(row.val)}</td>
                </tr>
              ))}
              <tr className="bg-ink-50 font-bold border-t border-ink-200">
                <td className="px-4 py-1.5 text-ink-800">Total Tributos</td>
                <td className="px-4 py-1.5 text-right text-ink-600">
                  {fmtPct(calc.totalTrib > 0 && calc.base > 0 ? (calc.totalTrib / calc.base) * 100 : 0)}
                </td>
                <td />
                <td className="px-4 py-1.5 text-right text-ink-900">{fmtR(calc.totalTrib)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Retenções table */}
        <div className="bg-white rounded-xl shadow-sm border border-ink-100 overflow-hidden">
          <p className="text-xs font-semibold text-ink-700 px-4 pt-3 pb-2">Retenções</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-ink-50 border-b border-ink-100 text-ink-500">
                <th className="px-4 py-1.5 text-left">Retenção</th>
                <th className="px-4 py-1.5 text-right">Alíquota</th>
                <th className="px-4 py-1.5 text-right">Base</th>
                <th className="px-4 py-1.5 text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'ISS Retido',  aliq: inputs.retISS,  val: calc.retISSv,  color: 'text-amber-700' },
                { name: 'CSRF',        aliq: inputs.retCSRF, val: calc.retCSRFv, color: 'text-ink-600' },
                { name: 'IRRF',        aliq: inputs.retIRRF, val: calc.retIRRFv, color: 'text-ink-600' },
                { name: 'INSS',        aliq: inputs.retINSS, val: calc.retINSSv, color: 'text-ink-600' },
              ].map((row) => (
                <tr key={row.name} className="border-b border-ink-50 hover:bg-ink-50/50">
                  <td className={`px-4 py-1.5 font-medium ${row.color}`}>{row.name}</td>
                  <td className="px-4 py-1.5 text-right text-ink-600">{fmtPct(row.aliq)}</td>
                  <td className="px-4 py-1.5 text-right text-ink-500">{fmtR(calc.base)}</td>
                  <td className={`px-4 py-1.5 text-right font-semibold ${row.color}`}>{fmtR(row.val)}</td>
                </tr>
              ))}
              <tr className="bg-ink-50 font-bold border-t border-ink-200">
                <td className="px-4 py-1.5 text-ink-800">Total Retenções</td>
                <td className="px-4 py-1.5 text-right text-ink-600">
                  {fmtPct(calc.base > 0 ? (calc.totalRet / calc.base) * 100 : 0)}
                </td>
                <td />
                <td className="px-4 py-1.5 text-right text-ink-900">{fmtR(calc.totalRet)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Reform info */}
        <div className="bg-primary-50 border border-primary-100 rounded-lg p-3 text-[11px] text-primary-700">
          <strong>Reforma {inputs.ano}:</strong>{' '}
          IBS = {(dim.aliquota_ibs * 100).toFixed(1)}% · CBS = {(dim.aliquota_cbs * 100).toFixed(1)}% ·
          Redução ISS = {(dim.reducao_iss * 100).toFixed(0)}% · Redução IBS/ICMS = {(dim.reducao_ibs * 100).toFixed(1)}%
        </div>
      </div>
    </div>
  )
}
