import { Asset } from '@/types/portfolio';
import { promises as fs } from 'fs';
import path from 'path';

const PORTFOLIO_FILE = path.join(process.cwd(), 'data', 'portfolio.json');

export async function getPortfolio(): Promise<Asset[]> {
  try {
    const data = await fs.readFile(PORTFOLIO_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler portfólio:', error);
    return [];
  }
}

export async function savePortfolio(portfolio: Asset[]): Promise<void> {
  try {
    const dir = path.dirname(PORTFOLIO_FILE);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(PORTFOLIO_FILE, JSON.stringify(portfolio, null, 2));
  } catch (error) {
    console.error('Erro ao salvar portfólio:', error);
    throw error;
  }
}

export async function addAsset(asset: Omit<Asset, 'id'>): Promise<Asset> {
  const portfolio = await getPortfolio();
  const newAsset: Asset = {
    ...asset,
    id: Date.now().toString(),
  };
  portfolio.push(newAsset);
  await savePortfolio(portfolio);
  return newAsset;
}

export async function updateAsset(id: string, updates: Partial<Asset>): Promise<Asset | null> {
  const portfolio = await getPortfolio();
  const index = portfolio.findIndex(asset => asset.id === id);
  
  if (index === -1) return null;
  
  portfolio[index] = { ...portfolio[index], ...updates };
  await savePortfolio(portfolio);
  return portfolio[index];
}

export async function deleteAsset(id: string): Promise<boolean> {
  const portfolio = await getPortfolio();
  const filteredPortfolio = portfolio.filter(asset => asset.id !== id);
  
  if (filteredPortfolio.length === portfolio.length) return false;
  
  await savePortfolio(filteredPortfolio);
  return true;
}