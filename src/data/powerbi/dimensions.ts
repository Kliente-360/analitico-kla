import type {
  DimEmpresa, DimUnidade, DimProduto, DimMunicipio,
  DimAliquotaReforma, DimIndicadorDRE,
} from './types'

export const DIM_EMPRESA: DimEmpresa[] = [
  { cod_empresa: 'EMP01', nome_empresa: 'Indústria Brasil S.A.' },
  { cod_empresa: 'EMP02', nome_empresa: 'Comércio Brasil Ltda.' },
]

export const DIM_UNIDADE: DimUnidade[] = [
  { cod_un: 'UN-SP', nome_un: 'Filial São Paulo',       cod_empresa: 'EMP01' },
  { cod_un: 'UN-RJ', nome_un: 'Filial Rio de Janeiro',  cod_empresa: 'EMP01' },
  { cod_un: 'UN-MG', nome_un: 'Filial Belo Horizonte',  cod_empresa: 'EMP02' },
  { cod_un: 'UN-PR', nome_un: 'Filial Curitiba',        cod_empresa: 'EMP02' },
]

export const DIM_PRODUTO: DimProduto[] = [
  // Eletrônicos (10)
  { cod_item: 'PROD-001', descricao_item: 'Notebook Corporativo 14"',    ncm: '84713012', categoria: 'Eletrônicos',        tipo_tributacao: 'tributado',  preco_unitario: 4500  },
  { cod_item: 'PROD-002', descricao_item: 'Desktop Workstation',          ncm: '84713029', categoria: 'Eletrônicos',        tipo_tributacao: 'tributado',  preco_unitario: 6200  },
  { cod_item: 'PROD-003', descricao_item: 'Monitor Full HD 27"',           ncm: '85285200', categoria: 'Eletrônicos',        tipo_tributacao: 'tributado',  preco_unitario: 1800  },
  { cod_item: 'PROD-004', descricao_item: 'Teclado Mecânico',              ncm: '84716060', categoria: 'Eletrônicos',        tipo_tributacao: 'tributado',  preco_unitario:  350  },
  { cod_item: 'PROD-005', descricao_item: 'Mouse Óptico Sem Fio',          ncm: '84716060', categoria: 'Eletrônicos',        tipo_tributacao: 'tributado',  preco_unitario:  180  },
  { cod_item: 'PROD-006', descricao_item: 'Headset Bluetooth',             ncm: '85183000', categoria: 'Eletrônicos',        tipo_tributacao: 'tributado',  preco_unitario:  420  },
  { cod_item: 'PROD-007', descricao_item: 'Webcam Full HD',                ncm: '85258000', categoria: 'Eletrônicos',        tipo_tributacao: 'tributado',  preco_unitario:  280  },
  { cod_item: 'PROD-008', descricao_item: 'Switch Gerenciável 24P',        ncm: '85176200', categoria: 'Eletrônicos',        tipo_tributacao: 'tributado',  preco_unitario: 3200  },
  { cod_item: 'PROD-009', descricao_item: 'Impressora Laser Color',        ncm: '84433190', categoria: 'Eletrônicos',        tipo_tributacao: 'tributado',  preco_unitario: 2800  },
  { cod_item: 'PROD-010', descricao_item: 'Scanner Documentos A3',         ncm: '84433120', categoria: 'Eletrônicos',        tipo_tributacao: 'tributado',  preco_unitario: 1950  },
  // Mobiliário (8)
  { cod_item: 'PROD-011', descricao_item: 'Cadeira Ergonômica',            ncm: '94013000', categoria: 'Mobiliário',         tipo_tributacao: 'tributado',  preco_unitario:  700  },
  { cod_item: 'PROD-012', descricao_item: 'Mesa de Escritório 1,8m',       ncm: '94033000', categoria: 'Mobiliário',         tipo_tributacao: 'tributado',  preco_unitario: 1200  },
  { cod_item: 'PROD-013', descricao_item: 'Armário com Fechadura',         ncm: '94033000', categoria: 'Mobiliário',         tipo_tributacao: 'tributado',  preco_unitario:  950  },
  { cod_item: 'PROD-014', descricao_item: 'Estante Modular',               ncm: '94036000', categoria: 'Mobiliário',         tipo_tributacao: 'tributado',  preco_unitario:  480  },
  { cod_item: 'PROD-015', descricao_item: 'Sofá Corporate 3 Lugares',      ncm: '94011000', categoria: 'Mobiliário',         tipo_tributacao: 'tributado',  preco_unitario: 3400  },
  { cod_item: 'PROD-016', descricao_item: 'Locker 6 Portas',               ncm: '94033000', categoria: 'Mobiliário',         tipo_tributacao: 'tributado',  preco_unitario:  860  },
  { cod_item: 'PROD-017', descricao_item: 'Poltrona Diretoria',            ncm: '94012000', categoria: 'Mobiliário',         tipo_tributacao: 'tributado',  preco_unitario: 2100  },
  { cod_item: 'PROD-018', descricao_item: 'Mesa de Reunião Oval',          ncm: '94033000', categoria: 'Mobiliário',         tipo_tributacao: 'tributado',  preco_unitario: 4800  },
  // Serviços (8)
  { cod_item: 'PROD-019', descricao_item: 'Consultoria Tributária',        ncm: '00000000', categoria: 'Serviços',           tipo_tributacao: 'servico',    preco_unitario: 12000 },
  { cod_item: 'PROD-020', descricao_item: 'TI Managed Services',           ncm: '00000000', categoria: 'Serviços',           tipo_tributacao: 'servico',    preco_unitario: 25000 },
  { cod_item: 'PROD-021', descricao_item: 'Assessoria Jurídica',           ncm: '00000000', categoria: 'Serviços',           tipo_tributacao: 'servico',    preco_unitario:  8500 },
  { cod_item: 'PROD-022', descricao_item: 'Serviços Contábeis',            ncm: '00000000', categoria: 'Serviços',           tipo_tributacao: 'servico',    preco_unitario:  5000 },
  { cod_item: 'PROD-023', descricao_item: 'Limpeza Empresarial',           ncm: '00000000', categoria: 'Serviços',           tipo_tributacao: 'servico',    preco_unitario:  3200 },
  { cod_item: 'PROD-024', descricao_item: 'Vigilância e Segurança',        ncm: '00000000', categoria: 'Serviços',           tipo_tributacao: 'servico',    preco_unitario:  7800 },
  { cod_item: 'PROD-025', descricao_item: 'Serviços de RH/Recrutamento',   ncm: '00000000', categoria: 'Serviços',           tipo_tributacao: 'servico',    preco_unitario:  9600 },
  { cod_item: 'PROD-026', descricao_item: 'Treinamento Corporativo',       ncm: '00000000', categoria: 'Serviços',           tipo_tributacao: 'servico',    preco_unitario:  4500 },
  // Alimentos (12)
  { cod_item: 'PROD-027', descricao_item: 'Café Torrado e Moído 500g',     ncm: '09012100', categoria: 'Alimentos',          tipo_tributacao: 'monofasico', preco_unitario:    28 },
  { cod_item: 'PROD-028', descricao_item: 'Chá de Ervas Misto 50un',       ncm: '09102090', categoria: 'Alimentos',          tipo_tributacao: 'monofasico', preco_unitario:    22 },
  { cod_item: 'PROD-029', descricao_item: 'Água Mineral 500ml cx24',       ncm: '22011000', categoria: 'Alimentos',          tipo_tributacao: 'isento',     preco_unitario:    38 },
  { cod_item: 'PROD-030', descricao_item: 'Biscoito Integral 400g',        ncm: '19053200', categoria: 'Alimentos',          tipo_tributacao: 'monofasico', preco_unitario:    16 },
  { cod_item: 'PROD-031', descricao_item: 'Barra de Cereal 30g cx50',      ncm: '19042000', categoria: 'Alimentos',          tipo_tributacao: 'monofasico', preco_unitario:    85 },
  { cod_item: 'PROD-032', descricao_item: 'Suco de Laranja 1L',            ncm: '20099900', categoria: 'Alimentos',          tipo_tributacao: 'monofasico', preco_unitario:    14 },
  { cod_item: 'PROD-033', descricao_item: 'Iogurte Grego 170g cx12',       ncm: '04031000', categoria: 'Alimentos',          tipo_tributacao: 'isento',     preco_unitario:    72 },
  { cod_item: 'PROD-034', descricao_item: 'Queijo Minas Frescal 500g',     ncm: '04061000', categoria: 'Alimentos',          tipo_tributacao: 'isento',     preco_unitario:    32 },
  { cod_item: 'PROD-035', descricao_item: 'Presunto Cozido 200g',          ncm: '16010010', categoria: 'Alimentos',          tipo_tributacao: 'monofasico', preco_unitario:    24 },
  { cod_item: 'PROD-036', descricao_item: 'Molho de Tomate 340g',          ncm: '21032000', categoria: 'Alimentos',          tipo_tributacao: 'isento',     preco_unitario:     9 },
  { cod_item: 'PROD-037', descricao_item: 'Macarrão Penne 500g',           ncm: '19021900', categoria: 'Alimentos',          tipo_tributacao: 'isento',     preco_unitario:     8 },
  { cod_item: 'PROD-038', descricao_item: 'Granola Premium 500g',          ncm: '19042000', categoria: 'Alimentos',          tipo_tributacao: 'monofasico', preco_unitario:    45 },
  // Software (5)
  { cod_item: 'PROD-039', descricao_item: 'Software ERP — licença anual', ncm: '00000000', categoria: 'Software',           tipo_tributacao: 'servico',    preco_unitario: 48000 },
  { cod_item: 'PROD-040', descricao_item: 'CRM Enterprise — licença anual',ncm: '00000000', categoria: 'Software',           tipo_tributacao: 'servico',    preco_unitario: 36000 },
  { cod_item: 'PROD-041', descricao_item: 'BI Analytics Suite',            ncm: '00000000', categoria: 'Software',           tipo_tributacao: 'servico',    preco_unitario: 24000 },
  { cod_item: 'PROD-042', descricao_item: 'ATS Recrutamento — SaaS',       ncm: '00000000', categoria: 'Software',           tipo_tributacao: 'servico',    preco_unitario: 18000 },
  { cod_item: 'PROD-043', descricao_item: 'Antivírus Corporativo',         ncm: '00000000', categoria: 'Software',           tipo_tributacao: 'servico',    preco_unitario:  9600 },
  // Material de Escritório (7)
  { cod_item: 'PROD-044', descricao_item: 'Papel A4 Resma 500fls cx10',    ncm: '48025690', categoria: 'Mat. Escritório',    tipo_tributacao: 'tributado',  preco_unitario:   280 },
  { cod_item: 'PROD-045', descricao_item: 'Caneta Esferográfica cx50',     ncm: '96081000', categoria: 'Mat. Escritório',    tipo_tributacao: 'tributado',  preco_unitario:    65 },
  { cod_item: 'PROD-046', descricao_item: 'Post-it 76×76mm cx12',          ncm: '48210090', categoria: 'Mat. Escritório',    tipo_tributacao: 'tributado',  preco_unitario:   120 },
  { cod_item: 'PROD-047', descricao_item: 'Grampeador Elétrico',           ncm: '82054000', categoria: 'Mat. Escritório',    tipo_tributacao: 'tributado',  preco_unitario:   340 },
  { cod_item: 'PROD-048', descricao_item: 'Pasta Arquivo Suspensa cx50',   ncm: '48236000', categoria: 'Mat. Escritório',    tipo_tributacao: 'tributado',  preco_unitario:   190 },
  { cod_item: 'PROD-049', descricao_item: 'Arquivo de Aço 4 Gavetas',      ncm: '83040000', categoria: 'Mat. Escritório',    tipo_tributacao: 'tributado',  preco_unitario:  1650 },
  { cod_item: 'PROD-050', descricao_item: 'Envelope Kraft A4 cx100',       ncm: '48190000', categoria: 'Mat. Escritório',    tipo_tributacao: 'tributado',  preco_unitario:    98 },
]

export const DIM_MUNICIPIO: DimMunicipio[] = [
  { cod_municipio_ibge: 3550308, nome_municipio: 'São Paulo',      uf: 'SP', latitude: -23.5505, longitude: -46.6333 },
  { cod_municipio_ibge: 3304557, nome_municipio: 'Rio de Janeiro', uf: 'RJ', latitude: -22.9068, longitude: -43.1729 },
  { cod_municipio_ibge: 3106200, nome_municipio: 'Belo Horizonte', uf: 'MG', latitude: -19.9167, longitude: -43.9345 },
  { cod_municipio_ibge: 4106902, nome_municipio: 'Curitiba',       uf: 'PR', latitude: -25.4284, longitude: -49.2733 },
  { cod_municipio_ibge: 2304400, nome_municipio: 'Fortaleza',      uf: 'CE', latitude:  -3.7172, longitude: -38.5433 },
  { cod_municipio_ibge: 4314902, nome_municipio: 'Porto Alegre',   uf: 'RS', latitude: -30.0346, longitude: -51.2177 },
]

export const DIM_ALIQUOTAS: DimAliquotaReforma[] = [
  { ano: 2024, aliquota_ibs: 0.000, aliquota_cbs: 0.000, reducao_iss: 0.000, reducao_ibs: 1.000 },
  { ano: 2027, aliquota_ibs: 0.001, aliquota_cbs: 0.009, reducao_iss: 0.000, reducao_ibs: 0.999 },
  { ano: 2028, aliquota_ibs: 0.005, aliquota_cbs: 0.088, reducao_iss: 0.100, reducao_ibs: 0.900 },
  { ano: 2029, aliquota_ibs: 0.053, aliquota_cbs: 0.088, reducao_iss: 0.200, reducao_ibs: 0.800 },
  { ano: 2030, aliquota_ibs: 0.106, aliquota_cbs: 0.088, reducao_iss: 0.400, reducao_ibs: 0.600 },
  { ano: 2031, aliquota_ibs: 0.159, aliquota_cbs: 0.088, reducao_iss: 0.600, reducao_ibs: 0.400 },
  { ano: 2032, aliquota_ibs: 0.212, aliquota_cbs: 0.088, reducao_iss: 0.800, reducao_ibs: 0.200 },
  { ano: 2033, aliquota_ibs: 0.177, aliquota_cbs: 0.088, reducao_iss: 1.000, reducao_ibs: 0.000 },
]

export const ANOS_REFORMA = [2024, 2027, 2028, 2029, 2030, 2031, 2032, 2033]

export const DIM_INDICADOR_DRE: DimIndicadorDRE[] = [
  { ordem:  1, nome_indicador: 'Receita Bruta',                        tipo: 'receita'   },
  { ordem:  2, nome_indicador: '(-) ICMS',                             tipo: 'deducao'   },
  { ordem:  3, nome_indicador: '(-) PIS/COFINS',                       tipo: 'deducao'   },
  { ordem:  4, nome_indicador: '(-) ISS',                              tipo: 'deducao'   },
  { ordem:  5, nome_indicador: '(-) IBS',                              tipo: 'deducao'   },
  { ordem:  6, nome_indicador: '(-) CBS',                              tipo: 'deducao'   },
  { ordem:  7, nome_indicador: 'Receita Líquida',                      tipo: 'subtotal'  },
  { ordem:  8, nome_indicador: '(-) Despesas com mercadoria/serviço',  tipo: 'despesa'   },
  { ordem:  9, nome_indicador: '(-) Despesas não recuperáveis',        tipo: 'despesa'   },
  { ordem: 10, nome_indicador: 'Lucro Bruto',                          tipo: 'subtotal'  },
  { ordem: 11, nome_indicador: 'Lucro Operacional',                    tipo: 'resultado' },
]
