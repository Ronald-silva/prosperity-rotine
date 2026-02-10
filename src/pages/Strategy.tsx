import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Target, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { AddObjectiveModal } from '../components/AddObjectiveModal';

export function Strategy() {
  const { objectives } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const weeks = objectives.filter(o => o.type === 'weekly');
  const months = objectives.filter(o => o.type === 'monthly');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <AddObjectiveModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sala de Guerra</h1>
          <p className="text-muted-foreground">Defina e rastreie seus objetivos estratégicos.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Target className="w-4 h-4" />
          Novo Objetivo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Sprint */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-6 text-purple-400">
            <Calendar className="w-5 h-5" />
            Sprint Semanal
          </h2>
          
          <div className="space-y-6">
            {weeks.map((obj) => (
              <div key={obj.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-foreground">{obj.title}</span>
                  <span className="text-muted-foreground">{obj.current} / {obj.target} {obj.unit}</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(obj.current / obj.target) * 100}%` }}
                    className="h-full bg-purple-500"
                  />
                </div>
              </div>
            ))}
            
            {weeks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed border-border rounded-lg">
                Nenhum objetivo para esta semana.
              </div>
            )}
          </div>
        </section>

        {/* Monthly Vision */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-6 text-blue-400">
            <TrendingUp className="w-5 h-5" />
            Visão Mensal
          </h2>
          
          <div className="space-y-6">
            {months.map((obj) => (
              <div key={obj.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">{obj.title}</span>
                    <span className="text-muted-foreground">{obj.current} / {obj.target} {obj.unit}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(obj.current / obj.target) * 100}%` }}
                      className="h-full bg-blue-500"
                    />
                  </div>
                </div>
            ))}
            
            {months.length === 0 && (
               <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed border-border rounded-lg">
                 Nenhum objetivo para este mês.
               </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
