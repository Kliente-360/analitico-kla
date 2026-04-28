export interface DimEmpresa {
  cod_empresa: string
  nome_empresa: string
}

export interface DimUnidade {
  cod_un: string
  nome_un: string
  cod_empresa: string
}

export type TipoTributacao = 'tributado' | 'isento' | 'monofasico' | 'servico'

export interface DimProduto {
  cod_item: string
  descricao_item: string
  ncm: string
  categoria: string
  tipo_tributacao: TipoTributacao
  preco_unitario: number
}

export interface DimMunicipio {
  cod_municipio_ibge: number
  nome_municipio: string
  uf: string
  latitude: number
  longitude: number
}

export interface DimAliquotaReforma {
  ano: number
  aliquota_ibs: number
  aliquota_cbs: number
  reducao_iss: number
  reducao_ibs: number
}

export interface DimIndicadorDRE {
  ordem: number
  nome_indicador: string
  tipo: 'receita' | 'deducao' | 'despesa' | 'subtotal' | 'resultado'
}

export interface FatoSaida {
  id_nota: string
  data_emissao: string
  cod_empresa: string
  cod_un: string
  cod_item: string
  cod_municipio_ibge: number
  tipo_nf: string
  quantidade: number
  valor_bruto: number
  valor_liquido: number
  valor_desconto: number
}

export interface FatoEntrada {
  id_nota: string
  data_emissao: string
  cod_empresa: string
  cod_un: string
  cod_item: string
  cod_municipio_ibge: number
  tipo_nf: string
  quantidade: number
  valor_bruto: number
  valor_liquido: number
  regime: 'Não Cumulativo' | 'Cumulativo'
  credito_de_icms: 'Sim' | 'Não'
  credito_pis_cofins: 'Sim' | 'Não'
  classificacao: 'Custo' | 'Despesa' | 'Ativo'
}

export type TributoNome = 'ICMS' | 'PIS_COFINS' | 'ISS' | 'IBS' | 'CBS'

export interface FatoTributo {
  id_nota: string
  direcao: 'Saída' | 'Entrada'
  ano: number
  tributo: TributoNome
  aliquota: number
  base_calculo: number
  valor_tributo: number
  tipo_movimento: 'Débito' | 'Crédito'
  escriturado: boolean
}
