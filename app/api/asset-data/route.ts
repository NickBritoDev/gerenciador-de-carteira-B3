import { NextRequest, NextResponse } from 'next/server';
import { getAssetData } from '@/lib/yahoo-finance';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    
    if (!symbol) {
      return NextResponse.json({ error: 'Símbolo do ativo é obrigatório' }, { status: 400 });
    }
    
    const data = await getAssetData(symbol);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar dados do ativo' }, { status: 500 });
  }
}