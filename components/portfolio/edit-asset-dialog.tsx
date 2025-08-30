'use client';

import { useState, useEffect } from 'react';
import { AssetWithData } from '@/types/portfolio';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EditAssetDialogProps {
  asset: AssetWithData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, updates: Partial<AssetWithData>) => void;
}

export function EditAssetDialog({ asset, open, onOpenChange, onUpdate }: EditAssetDialogProps) {
  const [formData, setFormData] = useState({
    ativo: '',
    nome: '',
    tipo: 'Ação' as 'Ação' | 'FII',
    qtdAtual: 0,
    qtdMeta: 0,
  });

  useEffect(() => {
    if (asset) {
      setFormData({
        ativo: asset.ativo,
        nome: asset.nome,
        tipo: asset.tipo,
        qtdAtual: asset.qtdAtual,
        qtdMeta: asset.qtdMeta,
      });
    }
  }, [asset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asset || !formData.ativo || !formData.nome || formData.qtdMeta <= 0) return;
    
    onUpdate(asset.id, formData);
    onOpenChange(false);
  };

  if (!asset) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Ativo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-ativo">Símbolo do Ativo</Label>
            <Input
              id="edit-ativo"
              placeholder="Ex: BBAS3.SA"
              value={formData.ativo}
              onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-nome">Nome do Ativo</Label>
            <Input
              id="edit-nome"
              placeholder="Ex: BBAS3"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-tipo">Tipo</Label>
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
              <Label htmlFor="edit-qtdAtual">Quantidade Atual</Label>
              <Input
                id="edit-qtdAtual"
                type="number"
                min="0"
                value={formData.qtdAtual}
                onChange={(e) => setFormData(prev => ({ ...prev, qtdAtual: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-qtdMeta">Meta de Cotas</Label>
              <Input
                id="edit-qtdMeta"
                type="number"
                min="1"
                value={formData.qtdMeta}
                onChange={(e) => setFormData(prev => ({ ...prev, qtdMeta: parseInt(e.target.value) || 0 }))}
                required
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}