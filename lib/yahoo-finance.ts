import { AssetData } from '@/types/portfolio';
import yahooFinance from 'yahoo-finance2';

export async function getAssetData(symbol: string): Promise<AssetData> {
  try {
    const quote: any = await yahooFinance.quote(symbol);
    return {
      preco: quote.regularMarketPrice ?? 0,
      pvp: quote.priceToBook?.toFixed(2) ?? "N/A",
      roe: quote.returnOnEquity?.toFixed(2) ?? "N/A",
      dy: quote.trailingAnnualDividendYield
        ? (quote.trailingAnnualDividendYield * 100).toFixed(2)
        : "N/A",
      variacao: quote.regularMarketChangePercent ?? 0,
    };
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