'use client';

import { useState, useEffect } from 'react';
import { Asset, AssetWithData } from '@/types/portfolio';

export function usePortfolio() {
  const [assets, setAssets] = useState<AssetWithData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPortfolio = async () => {
    try {
      const response = await fetch('/api/portfolio');
      const data = await response.json();
      setAssets(data.map((asset: Asset) => ({ ...asset, loading: true })));
      
      // Buscar dados de cada ativo
      for (const asset of data) {
        fetchAssetData(asset.id, asset.ativo);
      }
    } catch (error) {
      console.error('Erro ao buscar portfólio:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssetData = async (id: string, symbol: string) => {
    try {
      const response = await fetch(`/api/asset-data?symbol=${symbol}`);
      const data = await response.json();
      
      setAssets(prev => prev.map(asset => 
        asset.id === id 
          ? { ...asset, data, loading: false }
          : asset
      ));
    } catch (error) {
      console.error(`Erro ao buscar dados do ativo ${symbol}:`, error);
      setAssets(prev => prev.map(asset => 
        asset.id === id 
          ? { ...asset, loading: false }
          : asset
      ));
    }
  };

  const addAsset = async (asset: Omit<Asset, 'id'>) => {
    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(asset),
      });
      
      if (response.ok) {
        const newAsset = await response.json();
        setAssets(prev => [...prev, { ...newAsset, loading: true }]);
        fetchAssetData(newAsset.id, newAsset.ativo);
      }
    } catch (error) {
      console.error('Erro ao adicionar ativo:', error);
    }
  };

  const updateAsset = async (id: string, updates: Partial<Asset>) => {
    try {
      const response = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      
      if (response.ok) {
        const updatedAsset = await response.json();
        setAssets(prev => prev.map(asset => 
          asset.id === id ? { ...asset, ...updatedAsset } : asset
        ));
      }
    } catch (error) {
      console.error('Erro ao atualizar ativo:', error);
    }
  };

  const deleteAsset = async (id: string) => {
    try {
      const response = await fetch(`/api/portfolio?id=${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setAssets(prev => prev.filter(asset => asset.id !== id));
      }
    } catch (error) {
      console.error('Erro ao deletar ativo:', error);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  return {
    assets,
    loading,
    addAsset,
    updateAsset,
    deleteAsset,
    refreshData: fetchPortfolio,
  };
}