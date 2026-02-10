import { useState, useEffect, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { formatTime } from '../lib/utils';
import { playTimerEnd, playClick, sendNotification } from '../lib/sounds';
import { Play, Pause, RotateCcw, Brain, Coffee, Sunset } from 'lucide-react';
import { motion } from 'framer-motion';

type PomodoroMode = 'work' | 'shortBreak' | 'longBreak';

const MODE_CONFIG: Record<PomodoroMode, { label: string; color: string; icon: typeof Brain; gradient: string }> = {
  work: { label: 'Foco', color: 'hsl(var(--primary))', icon: Brain, gradient: 'from-purple-500 to-violet-600' },
  shortBreak: { label: 'Pausa Curta', color: '#22c55e', icon: Coffee, gradient: 'from-green-500 to-emerald-600' },
  longBreak: { label: 'Pausa Longa', color: '#3b82f6', icon: Sunset, gradient: 'from-blue-500 to-cyan-600' },
};

export function Focus() {
  const { settings } = useStore();

  const durations: Record<PomodoroMode, number> = {
    work: settings.pomodoroWork * 60,
    shortBreak: settings.pomodoroShortBreak * 60,
    longBreak: settings.pomodoroLongBreak * 60,
  };

  const [mode, setMode] = useState<PomodoroMode>('work');
  const [timeRemaining, setTimeRemaining] = useState(durations.work);
  const [isRunning, setIsRunning] = useState(false);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);

  const currentDuration = durations[mode];
  const progress = timeRemaining / currentDuration;
  const config = MODE_CONFIG[mode];
  const circumference = 2 * Math.PI * 90;

  const handleModeTransition = useCallback((currentMode: PomodoroMode, currentCycles: number) => {
    if (currentMode === 'work') {
      const newCycles = currentCycles + 1;
      setCyclesCompleted(newCycles);
      setTotalSessions(s => s + 1);

      if (newCycles >= 4) {
        setMode('longBreak');
        sendNotification('Pomodoro', 'Excelente! 4 ciclos completos. Pausa longa merecida!');
        return durations.longBreak;
      } else {
        setMode('shortBreak');
        sendNotification('Pomodoro', `Ciclo ${newCycles}/4 completo. Pausa curta!`);
        return durations.shortBreak;
      }
    } else {
      if (currentMode === 'longBreak') setCyclesCompleted(0);
      setMode('work');
      sendNotification('Pomodoro', 'Pausa acabou. Hora de focar, guerreiro!');
      return durations.work;
    }
  }, [durations]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          if (settings.soundEnabled) playTimerEnd();
          const nextDuration = handleModeTransition(mode, cyclesCompleted);
          return nextDuration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, mode, cyclesCompleted, settings.soundEnabled, handleModeTransition]);

  const switchMode = (newMode: PomodoroMode) => {
    if (isRunning) return;
    setMode(newMode);
    setTimeRemaining(durations[newMode]);
  };

  const reset = () => {
    setIsRunning(false);
    setTimeRemaining(durations[mode]);
  };

  const toggleTimer = () => {
    if (settings.soundEnabled) playClick();
    setIsRunning(!isRunning);
  };

  return (
    <div className="max-w-2xl mx-auto py-4 sm:py-8 lg:py-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8 lg:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
          Modo Foco Profundo
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1.5 sm:mt-2">Técnica Pomodoro para foco máximo</p>
      </div>

      {/* Mode Tabs */}
      <div className="flex justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8 lg:mb-10">
        {(Object.keys(MODE_CONFIG) as PomodoroMode[]).map((m) => {
          const cfg = MODE_CONFIG[m];
          const Icon = cfg.icon;
          const isActive = mode === m;
          return (
            <button
              key={m}
              onClick={() => switchMode(m)}
              disabled={isRunning}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                isActive
                  ? `bg-gradient-to-r ${cfg.gradient} text-white shadow-lg`
                  : 'bg-secondary text-muted-foreground hover:text-foreground disabled:opacity-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{cfg.label}</span>
              <span className="sm:hidden">{m === 'work' ? 'Foco' : m === 'shortBreak' ? 'Curta' : 'Longa'}</span>
            </button>
          );
        })}
      </div>

      {/* Timer Card */}
      <motion.div
        key={mode}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-card border border-border rounded-2xl p-6 sm:p-8 lg:p-10 flex flex-col items-center"
      >
        {/* Circular Progress */}
        <div className="relative w-52 h-52 sm:w-64 sm:h-64 lg:w-72 lg:h-72 mb-6 sm:mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100" cy="100" r="90"
              fill="none"
              stroke="hsl(var(--secondary))"
              strokeWidth="5"
            />
            <circle
              cx="100" cy="100" r="90"
              fill="none"
              stroke={config.color}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-mono font-bold tabular-nums text-foreground">
              {formatTime(timeRemaining)}
            </span>
            <span className="text-xs sm:text-sm text-muted-foreground mt-1.5 sm:mt-2 uppercase tracking-widest">
              {config.label}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 sm:gap-4 mb-6 sm:mb-8">
          <button
            onClick={toggleTimer}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all shadow-lg bg-gradient-to-r ${config.gradient} hover:opacity-90 active:scale-95`}
          >
            {isRunning
              ? <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-white text-white" />
              : <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white text-white ml-0.5" />
            }
          </button>
          <button
            onClick={reset}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Cycle Dots */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">Ciclos</span>
            <div className="flex gap-1 sm:gap-1.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${
                    i < cyclesCompleted
                      ? `bg-gradient-to-r ${config.gradient} shadow-sm`
                      : 'bg-secondary'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="text-[10px] sm:text-xs text-muted-foreground">
            <span className="text-foreground font-semibold">{totalSessions}</span> sessões hoje
          </div>
        </div>
      </motion.div>

      {/* Tips */}
      <div className="mt-4 sm:mt-6 lg:mt-8 bg-card/50 border border-border rounded-xl p-4 sm:p-6">
        <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 sm:mb-3">Dicas de Foco</h3>
        <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
          <li>Feche todas as abas desnecessárias antes de iniciar</li>
          <li>Coloque o celular em modo avião ou em outro cômodo</li>
          <li>Use fones com ruído branco se o ambiente for barulhento</li>
          <li>Na pausa, levante e se movimente — não fique na tela</li>
        </ul>
      </div>
    </div>
  );
}
