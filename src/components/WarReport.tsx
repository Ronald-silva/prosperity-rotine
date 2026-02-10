import { useState } from 'react';
import { useStore } from '../store/useStore';
import { playLevelUp } from '../lib/sounds';
import { Scroll, Trophy, X, Flame, Target, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WarReportProps {
  open: boolean;
  onClose: () => void;
}

export function WarReport({ open, onClose }: WarReportProps) {
  const { tasks, user, settings, endDay } = useStore();
  const [note, setNote] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const completed = tasks.filter(t => t.status === 'completed');
  const pending = tasks.filter(t => t.status === 'pending');
  const completedCount = completed.length;
  const totalCount = tasks.length;
  const rate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const xpEarned = completed.reduce((s, t) => s + t.xpReward, 0);

  const getRating = () => {
    if (rate === 100) return { label: 'PERFEITO', color: 'text-yellow-400', icon: Trophy };
    if (rate >= 80) return { label: 'EXCELENTE', color: 'text-green-400', icon: Flame };
    if (rate >= 50) return { label: 'MEDIANO', color: 'text-orange-400', icon: Target };
    return { label: 'PRECISA MELHORAR', color: 'text-red-400', icon: AlertTriangle };
  };

  const rating = getRating();
  const RatingIcon = rating.icon;

  const handleEndDay = () => {
    if (settings.soundEnabled && rate >= 80) playLevelUp();
    endDay(note);
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      setNote('');
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="bg-card border border-border rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            {!confirmed ? (
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Scroll className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-bold">Relatório de Guerra</h2>
                  </div>
                  <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Rating */}
                <div className="text-center py-4">
                  <RatingIcon className={`w-12 h-12 mx-auto mb-3 ${rating.color}`} />
                  <p className={`text-2xl font-bold ${rating.color}`}>{rating.label}</p>
                  <p className="text-5xl font-bold text-foreground mt-2">{rate}%</p>
                  <p className="text-sm text-muted-foreground mt-1">de conclusão</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-green-400">{completedCount}</p>
                    <p className="text-xs text-muted-foreground">Concluídas</p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-red-400">{pending.length}</p>
                    <p className="text-xs text-muted-foreground">Pendentes</p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-primary">{xpEarned}</p>
                    <p className="text-xs text-muted-foreground">XP ganho</p>
                  </div>
                </div>

                {/* Pending tasks */}
                {pending.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-red-400 mb-2">Tarefas não completadas:</p>
                    <div className="space-y-1">
                      {pending.map(t => (
                        <p key={t.id} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-red-500" />
                          {t.title}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Streak info */}
                <div className="flex items-center justify-between bg-secondary/30 rounded-lg p-3">
                  <span className="text-sm text-muted-foreground">Streak atual</span>
                  <div className="flex items-center gap-1.5 text-orange-400 font-bold">
                    <Flame className="w-4 h-4 fill-current" />
                    {user.streak} dias
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-2">
                    Nota pessoal (opcional)
                  </label>
                  <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="Como foi o dia? O que aprendeu? O que fazer diferente amanhã?"
                    rows={3}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleEndDay}
                    className="flex-1 px-4 py-3 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Encerrar Dia
                  </button>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 text-center"
              >
                <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">Dia encerrado!</h3>
                <p className="text-muted-foreground">Descanse. Amanhã é um novo campo de batalha.</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
