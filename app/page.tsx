'use client';

import { useState } from 'react';
import { AssetWithData } from '@/types/portfolio';
import { usePortfolio } from '@/hooks/use-portfolio';
import { AssetCard } from '@/components/portfolio/asset-card';
import { AddAssetDialog } from '@/components/portfolio/add-asset-dialog';
import { EditAssetDialog } from '@/components/portfolio/edit-asset-dialog';
import { PortfolioOverview } from '@/components/portfolio/portfolio-overview';
import { PortfolioFilters } from '@/components/portfolio/portfolio-filters';
import { Button } from '@/components/ui/button';
import { RefreshCw, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const { assets, loading, addAsset, updateAsset, deleteAsset, refreshData } = usePortfolio();
  const [editingAsset, setEditingAsset] = useState<AssetWithData | null>(null);
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const filteredAssets = assets.filter(asset => {
    if (filter === 'all') return true;
    return asset.tipo === filter;
  });

  const assetCounts = {
    total: assets.length,
    acoes: assets.filter(a => a.tipo === 'Ação').length,
    fiis: assets.filter(a => a.tipo === 'FII').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Carteira de Investimentos
              </h1>
              <p className="text-gray-600">
                Gerencie seus ativos e acompanhe suas metas
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="gap-2"
            >
              <RefreshCw className={cn(
                "h-4 w-4",
                refreshing && "animate-spin"
              )} />
              {refreshing ? 'Atualizando...' : 'Atualizar'}
            </Button>
            <AddAssetDialog onAdd={addAsset} />
          </div>
        </div>

        {/* Overview Cards */}
        <PortfolioOverview assets={assets} />

        {/* Filters */}
        <div className="flex items-center justify-between">
          <PortfolioFilters 
            activeFilter={filter}
            onFilterChange={setFilter}
            assetCounts={assetCounts}
          />
        </div>

        {/* Assets Grid */}
        {filteredAssets.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="space-y-4">
              <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {filter === 'all' ? 'Nenhum ativo encontrado' : `Nenhum ativo do tipo ${filter} encontrado`}
                </h3>
                <p className="text-gray-600 mt-1">
                  Comece adicionando alguns ativos à sua carteira
                </p>
              </div>
              <AddAssetDialog onAdd={addAsset} />
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAssets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                onEdit={setEditingAsset}
                onDelete={deleteAsset}
              />
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <EditAssetDialog
          asset={editingAsset}
          open={!!editingAsset}
          onOpenChange={(open) => !open && setEditingAsset(null)}
          onUpdate={updateAsset}
        />
      </div>
    </div>
  );
}