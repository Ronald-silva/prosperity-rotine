import { useStore } from '../store/useStore';
import { Trophy, Lock, Flame, Zap, Target, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const TYPE_ICONS: Record<string, typeof Trophy> = {
  streak: Flame,
  level: Star,
  xp: Zap,
  tasks: Target,
};

const TYPE_COLORS: Record<string, string> = {
  streak: 'text-orange-400 bg-orange-500/10',
  level: 'text-purple-400 bg-purple-500/10',
  xp: 'text-blue-400 bg-blue-500/10',
  tasks: 'text-green-400 bg-green-500/10',
};

export function Milestones() {
  const { milestones, user } = useStore();

  const getProgress = (type: string, target: number) => {
    let current = 0;
    switch (type) {
      case 'streak': current = user.streak; break;
      case 'level': current = user.level; break;
      case 'xp': current = user.xp; break;
      case 'tasks': current = user.totalTasksCompleted ?? 0; break;
    }
    return Math.min(100, Math.round((current / target) * 100));
  };

  const unlocked = milestones.filter(m => m.unlockedAt);
  const locked = milestones.filter(m => !m.unlockedAt);

  return (
    <div className="space-y-6">
      {/* Unlocked */}
      {unlocked.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Conquistados ({unlocked.length}/{milestones.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {unlocked.map((m, i) => {
              const Icon = TYPE_ICONS[m.type] ?? Trophy;
              const colors = TYPE_COLORS[m.type] ?? 'text-gray-400 bg-gray-500/10';
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card/50 border border-primary/30 rounded-xl p-4 flex gap-4"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${colors}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{m.title}</p>
                      <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                    </div>
                    <p className="text-xs text-muted-foreground">{m.description}</p>
                    <p className="text-xs text-primary mt-1">{m.reward}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Próximos Objetivos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {locked.map((m, i) => {
              const progress = getProgress(m.type, m.target);
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card/50 border border-border rounded-xl p-4 flex gap-4 opacity-80"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-secondary">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">{m.title}</p>
                    <p className="text-xs text-muted-foreground">{m.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary/60 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">{progress}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 italic">{m.reward}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
