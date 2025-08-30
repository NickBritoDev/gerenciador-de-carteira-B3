import { NextRequest, NextResponse } from 'next/server';
import { getPortfolio, addAsset, updateAsset, deleteAsset } from '@/lib/portfolio';

export async function GET() {
  try {
    const portfolio = await getPortfolio();
    return NextResponse.json(portfolio);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar portfólio' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const asset = await request.json();
    const newAsset = await addAsset(asset);
    return NextResponse.json(newAsset);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao adicionar ativo' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json();
    const updatedAsset = await updateAsset(id, updates);
    
    if (!updatedAsset) {
      return NextResponse.json({ error: 'Ativo não encontrado' }, { status: 404 });
    }
    
    return NextResponse.json(updatedAsset);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar ativo' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID do ativo é obrigatório' }, { status: 400 });
    }
    
    const deleted = await deleteAsset(id);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Ativo não encontrado' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar ativo' }, { status: 500 });
  }
}