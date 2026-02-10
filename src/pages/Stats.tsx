import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Trophy, Flame, Target, Zap } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { Milestones } from '../components/Milestones';

function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });
}

function getLast90Days(): string[] {
  return Array.from({ length: 90 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (89 - i));
    return d.toISOString().split('T')[0];
  });
}

function Heatmap({ history, todayDate, todayRate }: {
  history: { date: string; tasksCompleted: number; tasksTotal: number }[];
  todayDate: string;
  todayRate: number;
}) {
  const days = useMemo(() => getLast90Days(), []);

  const dayData = useMemo(() => {
    const map = new Map(history.map(r => [r.date, r]));
    return days.map(date => {
      if (date === todayDate) {
        return { date, rate: todayRate };
      }
      const record = map.get(date);
      if (!record || record.tasksTotal === 0) return { date, rate: -1 };
      return { date, rate: Math.round((record.tasksCompleted / record.tasksTotal) * 100) };
    });
  }, [days, history, todayDate, todayRate]);

  // Group into weeks (columns of 7)
  const weeks: typeof dayData[] = [];
  for (let i = 0; i < dayData.length; i += 7) {
    weeks.push(dayData.slice(i, i + 7));
  }

  const getCellColor = (rate: number) => {
    if (rate < 0) return 'bg-secondary/50';
    if (rate === 0) return 'bg-secondary';
    if (rate < 30) return 'bg-red-900/60';
    if (rate < 60) return 'bg-orange-800/60';
    if (rate < 80) return 'bg-purple-800/60';
    if (rate < 100) return 'bg-purple-600/70';
    return 'bg-purple-500';
  };

  return (
    <div className="bg-card/50 border border-border rounded-xl p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-semibold mb-1">Mapa de Consistência</h2>
      <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Últimos 90 dias — cada quadrado é um dia</p>

      <div className="flex gap-[3px] sm:gap-1 overflow-x-auto pb-2">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px] sm:gap-1">
            {week.map((day) => (
              <div
                key={day.date}
                title={`${day.date}: ${day.rate < 0 ? 'sem dados' : `${day.rate}%`}`}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm ${getCellColor(day.rate)} transition-colors`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4 text-[10px] sm:text-xs text-muted-foreground">
        <span>Menos</span>
        <div className="flex gap-0.5 sm:gap-1">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-secondary/50" />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-secondary" />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-red-900/60" />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-orange-800/60" />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-purple-800/60" />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-purple-600/70" />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-purple-500" />
        </div>
        <span>Mais</span>
      </div>
    </div>
  );
}

export function Stats() {
  const { user, tasks } = useStore();
  const history = Array.isArray(user.history) ? user.history : [];

  const todayCompleted = tasks.filter(t => t.status === 'completed');
  const todayXP = todayCompleted.reduce((sum, t) => sum + t.xpReward, 0);
  const todayRate = tasks.length > 0 ? Math.round((todayCompleted.length / tasks.length) * 100) : 0;

  const totalCompleted = history.reduce((sum, r) => sum + r.tasksCompleted, 0) + todayCompleted.length;
  const totalTasks = history.reduce((sum, r) => sum + r.tasksTotal, 0) + tasks.length;
  const overallRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  const last7 = getLast7Days();
  const today = new Date().toISOString().split('T')[0];

  const xpChartData = last7.map(date => {
    if (date === today) {
      return { label: format(parseISO(date), 'EEE', { locale: ptBR }), xp: todayXP };
    }
    const record = history.find(r => r.date === date);
    return { label: format(parseISO(date), 'EEE', { locale: ptBR }), xp: record?.xpEarned ?? 0 };
  });

  const completionChartData = last7.map(date => {
    if (date === today) {
      return { label: format(parseISO(date), 'EEE', { locale: ptBR }), rate: todayRate };
    }
    const record = history.find(r => r.date === date);
    const rate = record && record.tasksTotal > 0
      ? Math.round((record.tasksCompleted / record.tasksTotal) * 100)
      : 0;
    return { label: format(parseISO(date), 'EEE', { locale: ptBR }), rate };
  });

  const statCards = [
    {
      icon: Trophy,
      label: 'XP Total',
      value: user.xp.toLocaleString('pt-BR'),
      sub: `Level ${user.level}`,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      icon: Flame,
      label: 'Streak',
      value: `${user.streak} dias`,
      sub: `Melhor: ${user.bestStreak ?? 0}`,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
    },
    {
      icon: Target,
      label: 'Conclusão',
      value: `${overallRate}%`,
      sub: 'Taxa geral',
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
    {
      icon: Zap,
      label: 'Hoje',
      value: `${todayXP} XP`,
      sub: `${todayCompleted.length}/${tasks.length} tarefas`,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
  ];

  const tooltipStyle = {
    contentStyle: {
      background: 'hsl(222.2, 84%, 6%)',
      border: '1px solid hsl(217.2, 32.6%, 17.5%)',
      borderRadius: '8px',
      color: 'hsl(210, 40%, 98%)',
      fontSize: '13px',
    },
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 py-2 sm:py-4 lg:py-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Analytics
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Seu progresso e consistência</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-card/50 border border-border rounded-xl p-3 sm:p-5">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${card.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${card.color}`} />
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground truncate">{card.label}</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-foreground">{card.value}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Heatmap */}
      <Heatmap history={history} todayDate={today} todayRate={todayRate} />

      {/* XP Chart */}
      <div className="bg-card/50 border border-border rounded-xl p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-1">XP por Dia</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">Últimos 7 dias</p>
        <div className="h-48 sm:h-56 lg:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={xpChartData}>
              <defs>
                <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(263.4, 70%, 50.4%)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(263.4, 70%, 50.4%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217.2, 32.6%, 17.5%)" />
              <XAxis dataKey="label" stroke="hsl(215, 20.2%, 65.1%)" fontSize={12} />
              <YAxis stroke="hsl(215, 20.2%, 65.1%)" fontSize={12} />
              <Tooltip {...tooltipStyle} formatter={(value: number | undefined) => [`${value ?? 0} XP`, 'XP']} />
              <Area
                type="monotone"
                dataKey="xp"
                stroke="hsl(263.4, 70%, 50.4%)"
                strokeWidth={2}
                fill="url(#xpGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Completion Rate Chart */}
      <div className="bg-card/50 border border-border rounded-xl p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-1">Taxa de Conclusão</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">Porcentagem de tarefas completadas por dia</p>
        <div className="h-48 sm:h-56 lg:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={completionChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217.2, 32.6%, 17.5%)" />
              <XAxis dataKey="label" stroke="hsl(215, 20.2%, 65.1%)" fontSize={12} />
              <YAxis stroke="hsl(215, 20.2%, 65.1%)" fontSize={12} domain={[0, 100]} unit="%" />
              <Tooltip {...tooltipStyle} formatter={(value: number | undefined) => [`${value ?? 0}%`, 'Conclusão']} />
              <Bar
                dataKey="rate"
                fill="hsl(263.4, 70%, 50.4%)"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Milestones */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Conquistas & Recompensas</h2>
        <Milestones />
      </div>
    </div>
  );
}
