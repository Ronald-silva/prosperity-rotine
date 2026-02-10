import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { formatTime } from '../lib/utils';
import { playTimerEnd, sendNotification } from '../lib/sounds';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';

export function AntiProcrastination() {
  const { settings } = useStore();
  const [timer, setTimer] = useState(25 * 60);
  const [active, setActive] = useState(false);
  const [strategy, setStrategy] = useState<string | null>(null);

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          setActive(false);
          if (settings.soundEnabled) playTimerEnd();
          sendNotification('Prosperity Routine', 'Tempo esgotado! Descanse ou continue guerreiro.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [active, settings.soundEnabled]);

  const resetTimer = () => {
    setActive(false);
    setTimer(25 * 60);
  };

  const progress = timer / (25 * 60);

  const strategies = [
    "Regra dos 5 Minutos: Comece algo por apenas 5 minutos. Se quiser parar depois, pare.",
    "Quebre em Micro-tarefas: Qual a MENOR ação possível agora?",
    "Ambiente Radical: Tire o celular do cômodo e feche todas as abas exceto a de trabalho.",
    "Respiração 4-7-8 para acalmar a ansiedade de performance.",
    "Técnica do Corpo: Levante, lave o rosto com água gelada e volte para a cadeira.",
    "Regra dos 2 Minutos: Se leva menos de 2 minutos, faça AGORA.",
    "Visualize o Futuro: Como você vai se sentir às 23h tendo completado tudo?",
    "Elimine a Escolha: Não decida SE vai fazer. Decida COMO vai fazer.",
  ];

  const panic = () => {
    const random = strategies[Math.floor(Math.random() * strategies.length)];
    setStrategy(random);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 sm:space-y-10 lg:space-y-12 py-4 sm:py-8 lg:py-12 animate-in fade-in duration-500">
      {/* Panic Button */}
      <section className="text-center space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          ESTÁ Travado?
        </h2>

        <button
          onClick={panic}
          className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:shadow-[0_0_50px_rgba(220,38,38,0.8)] transition-all active:scale-95"
        >
          <span className="flex items-center gap-2 text-base sm:text-xl">
            <Zap className="fill-yellow-300 text-yellow-300 animate-pulse w-5 h-5 sm:w-6 sm:h-6" />
            QUEBRAR INÉRCIA AGORA
          </span>
        </button>

        {strategy && (
          <div className="bg-card border border-red-900/50 p-4 sm:p-6 rounded-xl animate-in fade-in slide-in-from-bottom-4">
            <p className="text-sm sm:text-lg font-medium text-red-200">
              {strategy}
            </p>
          </div>
        )}
      </section>

      <div className="w-full h-px bg-border/50" />

      {/* Focus Timer */}
      <section className="bg-card border border-border rounded-xl p-5 sm:p-6 lg:p-8 flex flex-col items-center">
        <h3 className="text-sm sm:text-lg font-mono text-muted-foreground uppercase tracking-widest mb-4 sm:mb-6">
          High Intensity Interval
        </h3>

        {/* Circular progress */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 mb-6 sm:mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100" cy="100" r="90"
              fill="none"
              stroke="hsl(var(--secondary))"
              strokeWidth="6"
            />
            <circle
              cx="100" cy="100" r="90"
              fill="none"
              stroke={timer === 0 ? 'hsl(0, 62.8%, 30.6%)' : 'hsl(var(--primary))'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 90}
              strokeDashoffset={2 * Math.PI * 90 * (1 - progress)}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-mono font-bold tabular-nums text-foreground">
              {formatTime(timer)}
            </span>
          </div>
        </div>

        <div className="flex gap-3 sm:gap-4">
          <button
            onClick={() => setActive(!active)}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors"
          >
            {active ? <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-white text-white" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white text-white ml-0.5" />}
          </button>
          <button
            onClick={resetTimer}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          </button>
        </div>
      </section>
    </div>
  );
}
