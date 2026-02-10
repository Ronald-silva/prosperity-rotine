import { useState, useEffect, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { CheckCircle2, Flame, Target, Clock, Scroll } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';
import { playTaskComplete, playLevelUp } from '../lib/sounds';
import { toast } from 'sonner';
import { WarReport } from '../components/WarReport';

export function Dashboard() {
  const { tasks, toggleTask, user, settings, checkMilestones } = useStore();
  const [warReportOpen, setWarReportOpen] = useState(false);
  const [now, setNow] = useState(Date.now());

  // Tick every 30s for shame timer
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(interval);
  }, []);

  const categories: Record<string, string> = {
    core: 'Núcleo Obrigatório',
    technical: 'Desenvolvimento Técnico',
    expansion: 'Expansão Mental',
    passive: 'Aprendizado Passivo',
    spiritual: 'Disciplina Espiritual',
    strategic: 'Estratégico',
  };

  const categoryColors: Record<string, string> = {
    core: 'bg-red-500',
    technical: 'bg-blue-500',
    expansion: 'bg-green-500',
    passive: 'bg-slate-500',
    spiritual: 'bg-purple-500',
    strategic: 'bg-amber-500',
  };

  const tasksByCategory = tasks.reduce((acc, task) => {
    if (!acc[task.category]) acc[task.category] = [];
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, typeof tasks>);

  const activeCategories = Object.entries(categories).filter(([key]) => tasksByCategory[key]?.length > 0);

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Shame timer: time since last task completion (or start of day)
  const shameTimer = useMemo(() => {
    const completedTasks = tasks
      .filter(t => t.completedAt)
      .map(t => new Date(t.completedAt!).getTime());

    if (completedTasks.length === 0) {
      // No tasks completed today — time since midnight
      const midnight = new Date();
      midnight.setHours(0, 0, 0, 0);
      return now - midnight.getTime();
    }

    const lastCompletion = Math.max(...completedTasks);
    return now - lastCompletion;
  }, [tasks, now]);

  const shameMinutes = Math.floor(shameTimer / 60_000);
  const shameHours = Math.floor(shameMinutes / 60);
  const shameDisplay = shameHours > 0
    ? `${shameHours}h ${shameMinutes % 60}m`
    : `${shameMinutes}m`;

  // Color: green <15m, yellow <60m, orange <120m, red >120m
  const shameColor = completedCount === totalCount
    ? 'text-green-400'
    : shameMinutes < 15 ? 'text-green-400'
    : shameMinutes < 60 ? 'text-yellow-400'
    : shameMinutes < 120 ? 'text-orange-400'
    : 'text-red-400';

  const shameBg = completedCount === totalCount
    ? 'bg-green-500/10 border-green-500/20'
    : shameMinutes < 15 ? 'bg-green-500/10 border-green-500/20'
    : shameMinutes < 60 ? 'bg-yellow-500/10 border-yellow-500/20'
    : shameMinutes < 120 ? 'bg-orange-500/10 border-orange-500/20'
    : 'bg-red-500/10 border-red-500/20';

  const shameMessage = completedCount === totalCount
    ? 'Todas as missões completas!'
    : shameMinutes < 15 ? 'Boa, mantenha o ritmo'
    : shameMinutes < 60 ? 'Está parado há um tempo...'
    : shameMinutes < 120 ? 'A inércia está vencendo!'
    : 'ALERTA: Procrastinação detectada!';

  const handleToggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const wasCompleted = task.status === 'completed';
    const prevLevel = user.level;

    toggleTask(id);

    if (settings.soundEnabled && !wasCompleted) {
      playTaskComplete();

      const expectedNewXP = user.xp + task.xpReward;
      const expectedNewLevel = Math.floor(expectedNewXP / 1000) + 1;
      if (expectedNewLevel > prevLevel) {
        setTimeout(() => {
          playLevelUp();
          toast('Level Up!', {
            description: `Você alcançou o nível ${expectedNewLevel}! Continue firme, guerreiro.`,
            duration: 5000,
          });
        }, 300);
      }
    }

    // Check milestones after toggle
    setTimeout(() => {
      const newMilestones = checkMilestones();
      newMilestones.forEach(title => {
        toast('Milestone Desbloqueado!', {
          description: title,
          duration: 6000,
        });
      });
    }, 500);
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-in fade-in duration-500">

      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl p-5 sm:p-6 lg:p-8 relative overflow-hidden border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1.5 sm:mb-2">
              Foco do Dia
            </h1>
            <p className="text-indigo-200 text-sm sm:text-base mb-4 sm:mb-6 max-w-lg">
              "A única coisa que importa é a execução consistente."
            </p>

            <div className="flex items-center gap-3 sm:gap-4 bg-white/5 backdrop-blur-md rounded-lg p-3 sm:p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-indigo-400 flex items-center justify-center group-hover:bg-indigo-400/20 shrink-0">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-indigo-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-sm sm:text-lg font-medium text-white">
                Finalizar o módulo de IA Avançada
              </span>
            </div>
          </div>

          <Target className="absolute -right-8 -bottom-8 w-40 sm:w-64 h-40 sm:h-64 text-indigo-500/10 rotate-12" />
        </div>

        {/* Stats Card */}
        <div className="bg-card border border-border rounded-xl p-4 sm:p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-muted-foreground mb-3 sm:mb-4">Progresso Diário</h3>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl sm:text-5xl font-bold text-primary">{Math.round(progress)}%</span>
              <span className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">concluído</span>
            </div>
            <div className="h-2.5 sm:h-3 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-purple-400 transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Streak Atual</span>
            <div className="flex items-center gap-1.5 text-orange-500 font-bold">
              <Flame className="w-4 h-4 fill-current" />
              {user.streak}
            </div>
          </div>
        </div>
      </div>

      {/* Shame Timer */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-3 sm:p-4 rounded-xl border transition-colors ${shameBg}`}>
        <div className="flex items-center gap-3">
          <Clock className={`w-5 h-5 shrink-0 ${shameColor}`} />
          <div>
            <p className={`text-xs sm:text-sm font-semibold ${shameColor}`}>{shameMessage}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              {completedCount === totalCount
                ? `${completedCount}/${totalCount} tarefas concluídas`
                : `Última ação há ${shameDisplay}`
              }
            </p>
          </div>
        </div>
        <button
          onClick={() => setWarReportOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-secondary text-muted-foreground hover:text-foreground rounded-lg text-xs sm:text-sm font-medium transition-colors w-full sm:w-auto justify-center sm:justify-start"
        >
          <Scroll className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Encerrar Dia
        </button>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {activeCategories.map(([key, label]) => (
          <div key={key} className="bg-card/50 border border-border rounded-xl p-4 sm:p-5 hover:border-primary/50 transition-colors">
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
              <span className={cn("w-2 h-6 sm:h-8 rounded-full", categoryColors[key] ?? 'bg-slate-500')} />
              {label}
            </h3>

            <div className="space-y-3">
              {tasksByCategory[key]?.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={false}
                  onClick={() => handleToggleTask(task.id)}
                  className={cn(
                    "group flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all duration-200 select-none",
                    task.status === 'completed'
                      ? "bg-primary/5 border-primary/20 opacity-60"
                      : "bg-background border-transparent hover:bg-accent hover:border-border"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                    task.status === 'completed'
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-muted-foreground group-hover:border-primary"
                  )}>
                    {task.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span className={cn(
                    "text-sm font-medium transition-all",
                    task.status === 'completed' ? "line-through text-muted-foreground" : "text-foreground"
                  )}>
                    {task.title}
                  </span>

                  {task.status !== 'completed' && (
                    <span className="ml-auto text-xs font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      +{task.xpReward}xp
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <WarReport open={warReportOpen} onClose={() => setWarReportOpen(false)} />
    </div>
  );
}
