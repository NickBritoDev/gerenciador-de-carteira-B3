export interface Asset {
  id: string;
  ativo: string;
  nome: string;
  tipo: 'Ação' | 'FII';
  qtdAtual: number;
  qtdMeta: number;
}

export interface AssetData {
  preco: number;
  pvp: number | string;
  roe: number | string;
  dy: number | string;
  variacao: number;
}

export interface AssetWithData extends Asset {
  data?: AssetData;
  loading?: boolean;
}