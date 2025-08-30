import { AssetData } from '@/types/portfolio';

// Mock function - Em produção você poderia usar yahoo-finance2 ou outra API
export async function getAssetData(symbol: string): Promise<AssetData> {
  try {
    // Simulando dados para demonstração
    // Em produção, você integraria com Yahoo Finance ou outra API
    const mockData: AssetData = {
      preco: Math.random() * 100 + 10,
      pvp: (Math.random() * 3 + 0.5).toFixed(2),
      roe: (Math.random() * 25 + 5).toFixed(2),
      dy: (Math.random() * 10 + 2).toFixed(2),
      variacao: (Math.random() * 10 - 5),
    };

    // Adicionando um delay para simular requisição real
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    return mockData;
  } catch (error) {
    console.error(`Erro ao buscar dados para ${symbol}:`, error);
    return {
      preco: 0,
      pvp: "N/A",
      roe: "N/A",
      dy: "N/A",
      variacao: 0,
    };
  }
}