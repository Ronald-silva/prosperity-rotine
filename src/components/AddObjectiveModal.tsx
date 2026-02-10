
import React, { useState } from 'react';
import { useStore, type Objective } from '../store/useStore';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AddObjectiveModal({ isOpen, onClose }: Props) {
  const { addObjective } = useStore();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Objective['type']>('weekly');
  const [target, setTarget] = useState('');
  const [unit, setUnit] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newObjective: Objective = {
      id: crypto.randomUUID(),
      title,
      type,
      progress: 0,
      target: Number(target),
      current: 0,
      unit,
    };
    addObjective(newObjective);
    onClose();
    setTitle('');
    setTarget('');
    setUnit('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 p-3 sm:p-4">
      <div className="bg-card w-full max-w-md p-4 sm:p-6 rounded-xl border border-border shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold">Novo Objetivo</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Título</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-secondary rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50 border border-transparent focus:border-primary transition-all"
              placeholder="Ex: Faturar R$ 10k"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Tipo</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-secondary rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
                <option value="life">Vida</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Unidade</label>
              <input
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-secondary rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Ex: BRL, %, Kg"
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium mb-1.5">Meta Numérica</label>
             <input
                required
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full bg-secondary rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="100"
              />
          </div>

          <div className="pt-2 flex justify-end gap-3">
             <button
               type="button"
               onClick={onClose}
               className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
             >
               Cancelar
             </button>
             <button
               type="submit"
               className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/20"
             >
               Criar Objetivo
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
