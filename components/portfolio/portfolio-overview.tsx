'use client';

import { AssetWithData } from '@/types/portfolio';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Wallet, PieChart } from 'lucide-react';

interface PortfolioOverviewProps {
  assets: AssetWithData[];
}

export function PortfolioOverview({ assets }: PortfolioOverviewProps) {
  const totalAssets = assets.length;
  const totalMetas = assets.reduce((sum, asset) => sum + asset.qtdMeta, 0);
  const totalAtual = assets.reduce((sum, asset) => sum + asset.qtdAtual, 0);
  const metasCompletas = assets.filter(asset => asset.qtdAtual >= asset.qtdMeta).length;
  
  const valorTotal = assets.reduce((sum, asset) => {
    if (asset.data?.preco) {
      return sum + (asset.data.preco * asset.qtdAtual);
    }
    return sum;
  }, 0);

  const valorMeta = assets.reduce((sum, asset) => {
    if (asset.data?.preco) {
      return sum + (asset.data.preco * asset.qtdMeta);
    }
    return sum;
  }, 0);

  const progressoGeral = totalMetas > 0 ? (totalAtual / totalMetas) * 100 : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const acoes = assets.filter(asset => asset.tipo === 'Ação');
  const fiis = assets.filter(asset => asset.tipo === 'FII');

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Ativos</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAssets}</div>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {acoes.length} Ações
            </Badge>
            <Badge variant="outline" className="text-xs">
              {fiis.length} FIIs
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor da Carteira</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(valorTotal)}</div>
          <p className="text-xs text-muted-foreground mt-2">
            Meta: {formatCurrency(valorMeta)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Progresso Geral</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{progressoGeral.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground mt-2">
            {totalAtual} de {totalMetas} cotas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Metas Completas</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metasCompletas}</div>
          <p className="text-xs text-muted-foreground mt-2">
            de {totalAssets} ativos
          </p>
        </CardContent>
      </Card>
    </div>
  );
}