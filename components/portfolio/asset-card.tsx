'use client';

import { AssetWithData } from '@/types/portfolio';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssetCardProps {
  asset: AssetWithData;
  onEdit: (asset: AssetWithData) => void;
  onDelete: (id: string) => void;
}

export function AssetCard({ asset, onEdit, onDelete }: AssetCardProps) {
  const progress = (asset.qtdAtual / asset.qtdMeta) * 100;
  const isComplete = asset.qtdAtual >= asset.qtdMeta;
  const qtdRestante = Math.max(0, asset.qtdMeta - asset.qtdAtual);
  
  const formatValue = (value: number | string) => {
    if (typeof value === 'string') return value;
    return value.toFixed(2);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getVariationColor = (variation: number) => {
    if (variation > 0) return 'text-emerald-600';
    if (variation < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg font-semibold">{asset.nome}</CardTitle>
            <Badge 
              variant={asset.tipo === 'Ação' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {asset.tipo}
            </Badge>
          </div>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(asset)}
              className="h-8 w-8 p-0"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(asset.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{asset.ativo}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Preço e Variação */}
        {asset.loading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ) : asset.data ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">
                {formatCurrency(asset.data.preco)}
              </p>
              <div className={cn(
                "flex items-center gap-1 text-sm font-medium",
                getVariationColor(asset.data.variacao)
              )}>
                {asset.data.variacao > 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {asset.data.variacao > 0 ? '+' : ''}{asset.data.variacao.toFixed(2)}%
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Dados não disponíveis</p>
        )}

        {/* Progresso da Meta */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso da Meta</span>
            <span className={cn(
              "font-medium",
              isComplete ? "text-emerald-600" : "text-muted-foreground"
            )}>
              {asset.qtdAtual}/{asset.qtdMeta}
            </span>
          </div>
          <Progress 
            value={progress} 
            className={cn(
              "h-2",
              isComplete && "bg-emerald-100"
            )}
          />
          <p className="text-xs text-muted-foreground">
            {isComplete 
              ? '🎯 Meta alcançada!' 
              : `Faltam ${qtdRestante} cotas para atingir a meta`
            }
          </p>
        </div>

        {/* Indicadores Fundamentalistas */}
        {asset.data && (
          <div className="grid grid-cols-3 gap-2 pt-2 border-t">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">P/VP</p>
              <p className="font-semibold text-sm">{formatValue(asset.data.pvp)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">ROE</p>
              <p className="font-semibold text-sm">
                {typeof asset.data.roe === 'number' ? `${formatValue(asset.data.roe)}%` : asset.data.roe}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">DY</p>
              <p className="font-semibold text-sm">
                {typeof asset.data.dy === 'number' ? `${formatValue(asset.data.dy)}%` : asset.data.dy}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}