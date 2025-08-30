'use client';

import { useState } from 'react';
import { Asset } from '@/types/portfolio';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface AddAssetDialogProps {
  onAdd: (asset: Omit<Asset, 'id'>) => void;
}

export function AddAssetDialog({ onAdd }: AddAssetDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    ativo: '',
    nome: '',
    tipo: 'Ação' as 'Ação' | 'FII',
    qtdAtual: 0,
    qtdMeta: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ativo || !formData.nome || formData.qtdMeta <= 0) return;
    
    onAdd(formData);
    setFormData({
      ativo: '',
      nome: '',
      tipo: 'Ação',
      qtdAtual: 0,
      qtdMeta: 0,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Ativo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Ativo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ativo">Símbolo do Ativo</Label>
            <Input
              id="ativo"
              placeholder="Ex: BBAS3.SA"
              value={formData.ativo}
              onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Ativo</Label>
            <Input
              id="nome"
              placeholder="Ex: BBAS3"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo</Label>
            <Select 
              value={formData.tipo} 
              onValueChange={(value: 'Ação' | 'FII') => 
                setFormData(prev => ({ ...prev, tipo: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ação">Ação</SelectItem>
                <SelectItem value="FII">FII</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="qtdAtual">Quantidade Atual</Label>
              <Input
                id="qtdAtual"
                type="number"
                min="0"
                value={formData.qtdAtual}
                onChange={(e) => setFormData(prev => ({ ...prev, qtdAtual: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qtdMeta">Meta de Cotas</Label>
              <Input
                id="qtdMeta"
                type="number"
                min="1"
                value={formData.qtdMeta}
                onChange={(e) => setFormData(prev => ({ ...prev, qtdMeta: parseInt(e.target.value) || 0 }))}
                required
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Adicionar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}