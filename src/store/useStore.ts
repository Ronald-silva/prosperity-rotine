import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TaskResult = 'pending' | 'completed' | 'skipped' | 'failed';
export type TaskCategory = 'core' | 'technical' | 'expansion' | 'passive' | 'spiritual' | 'strategic';

export interface Objective {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly' | 'life';
  progress: number;
  target: number;
  current: number;
  unit: string;
}

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  status: TaskResult;
  xpReward: number;
  completedAt?: string;
}

export interface DayRecord {
  date: string;
  tasksCompleted: number;
  tasksTotal: number;
  xpEarned: number;
  note?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  type: 'streak' | 'level' | 'xp' | 'tasks';
  target: number;
  reward: string;
  unlockedAt?: string;
}

export interface SettingsState {
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  pomodoroWork: number;
  pomodoroShortBreak: number;
  pomodoroLongBreak: number;
}

interface UserState {
  xp: number;
  level: number;
  streak: number;
  bestStreak: number;
  lastActive: string;
  history: DayRecord[];
  morningRitualDate: string;
  totalTasksCompleted: number;
}

interface AppState {
  tasks: Task[];
  objectives: Objective[];
  user: UserState;
  settings: SettingsState;
  milestones: Milestone[];

  dayEnded: boolean;

  toggleTask: (id: string) => void;
  addXP: (amount: number) => void;
  checkStreak: () => void;
  addObjective: (objective: Objective) => void;
  removeObjective: (id: string) => void;

  addTask: (task: Omit<Task, 'id' | 'status' | 'completedAt'>) => void;
  removeTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Pick<Task, 'title' | 'category' | 'xpReward'>>) => void;

  updateSettings: (settings: Partial<SettingsState>) => void;
  initializeDay: () => void;

  completeMorningRitual: () => void;
  endDay: (note: string) => void;
  checkMilestones: () => string[];
}

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Exercício manhã', category: 'core', status: 'pending', xpReward: 50 },
  { id: '2', title: 'Programação', category: 'core', status: 'pending', xpReward: 100 },
  { id: '3', title: 'Funil / Tráfego / IA', category: 'core', status: 'pending', xpReward: 100 },
  { id: '4', title: 'IA ou Bitcoin (rotativo)', category: 'technical', status: 'pending', xpReward: 40 },
  { id: '5', title: 'Inglês (20–30 min)', category: 'technical', status: 'pending', xpReward: 30 },
  { id: '6', title: 'Social media — 1 ação', category: 'technical', status: 'pending', xpReward: 30 },
  { id: '7', title: 'Leitura', category: 'expansion', status: 'pending', xpReward: 30 },
  { id: '8', title: 'Bíblia — estudo técnico', category: 'expansion', status: 'pending', xpReward: 40 },
  { id: '9', title: 'Áudio na moto', category: 'passive', status: 'pending', xpReward: 10 },
  { id: '10', title: 'Dia de jejum', category: 'spiritual', status: 'pending', xpReward: 100 },
];

const DEFAULT_MILESTONES: Milestone[] = [
  { id: 'm1', title: 'Primeiro Passo', description: 'Complete seu primeiro dia', type: 'streak', target: 1, reward: 'Você provou que consegue começar.' },
  { id: 'm2', title: 'Semana de Ferro', description: 'Mantenha 7 dias de streak', type: 'streak', target: 7, reward: 'Uma refeição especial ou descanso merecido.' },
  { id: 'm3', title: 'Quinzena Inabalável', description: '14 dias consecutivos', type: 'streak', target: 14, reward: 'Compre algo que queria há tempo.' },
  { id: 'm4', title: 'Mês de Aço', description: '30 dias sem falhar', type: 'streak', target: 30, reward: 'Dia inteiro de folga sem culpa.' },
  { id: 'm5', title: 'Soldado', description: 'Alcance o nível 5', type: 'level', target: 5, reward: 'Você já não é mais um recruta.' },
  { id: 'm6', title: 'Centurião', description: 'Alcance o nível 10', type: 'level', target: 10, reward: 'Um presente de valor para si mesmo.' },
  { id: 'm7', title: 'General', description: 'Alcance o nível 25', type: 'level', target: 25, reward: 'Você é uma máquina de execução.' },
  { id: 'm8', title: 'Executor', description: 'Complete 100 tarefas no total', type: 'tasks', target: 100, reward: 'A disciplina já faz parte de você.' },
  { id: 'm9', title: 'Implacável', description: 'Complete 500 tarefas no total', type: 'tasks', target: 500, reward: 'Nada te para mais.' },
  { id: 'm10', title: '10K XP', description: 'Acumule 10.000 XP', type: 'xp', target: 10000, reward: 'Invista em algo para seu crescimento.' },
];

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

function migrateHistory(raw: unknown): DayRecord[] {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'object' && raw !== null) {
    return Object.entries(raw).map(([date, xp]) => ({
      date,
      tasksCompleted: 0,
      tasksTotal: 0,
      xpEarned: xp as number,
    }));
  }
  return [];
}

function snapshotDay(tasks: Task[], date: string, note?: string): DayRecord {
  const completed = tasks.filter(t => t.status === 'completed');
  return {
    date,
    tasksCompleted: completed.length,
    tasksTotal: tasks.length,
    xpEarned: completed.reduce((sum, t) => sum + t.xpReward, 0),
    note,
  };
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      tasks: INITIAL_TASKS,
      objectives: [],
      user: {
        xp: 0,
        level: 1,
        streak: 0,
        bestStreak: 0,
        lastActive: getToday(),
        history: [],
        morningRitualDate: '',
        totalTasksCompleted: 0,
      },
      settings: {
        soundEnabled: true,
        notificationsEnabled: false,
        pomodoroWork: 25,
        pomodoroShortBreak: 5,
        pomodoroLongBreak: 15,
      },
      milestones: DEFAULT_MILESTONES,
      dayEnded: false,

      toggleTask: (id) => set((state) => {
        const task = state.tasks.find((t) => t.id === id);
        if (!task) return state;

        const wasCompleted = task.status === 'completed';
        const newStatus: TaskResult = wasCompleted ? 'pending' : 'completed';
        const xpDelta = wasCompleted ? -task.xpReward : task.xpReward;
        const newXP = Math.max(0, state.user.xp + xpDelta);
        const newLevel = Math.floor(newXP / 1000) + 1;
        const tasksDelta = wasCompleted ? -1 : 1;

        return {
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, status: newStatus, completedAt: !wasCompleted ? new Date().toISOString() : undefined }
              : t
          ),
          user: {
            ...state.user,
            xp: newXP,
            level: newLevel,
            lastActive: getToday(),
            totalTasksCompleted: Math.max(0, (state.user.totalTasksCompleted ?? 0) + tasksDelta),
          },
        };
      }),

      addXP: (amount) => set((state) => {
        const newXP = Math.max(0, state.user.xp + amount);
        const newLevel = Math.floor(newXP / 1000) + 1;
        return {
          user: { ...state.user, xp: newXP, level: newLevel },
        };
      }),

      checkStreak: () => {
        get().initializeDay();
      },

      initializeDay: () => {
        const today = getToday();
        const state = get();
        const lastActive = state.user.lastActive;

        if (today === lastActive) return;

        const history = migrateHistory(state.user.history);

        // Only create a snapshot for lastActive if endDay didn't already save one
        const alreadySnapshotted = history.some(r => r.date === lastActive);
        const record = alreadySnapshotted ? null : snapshotDay(state.tasks, lastActive);
        const newHistory = record
          ? [...history.filter(r => r.date !== lastActive), record]
          : history;

        // For streak calculation, use the saved snapshot if available
        const lastDayRecord = alreadySnapshotted
          ? history.find(r => r.date === lastActive)
          : record;

        const yesterday = getYesterday();
        let newStreak = state.user.streak;

        if (lastActive === yesterday && lastDayRecord && lastDayRecord.tasksCompleted > 0) {
          newStreak = state.user.streak + 1;
        } else {
          // Reset streak if: missed a day entirely, OR was active but completed 0 tasks
          newStreak = 0;
        }

        const currentBest = state.user.bestStreak ?? state.user.streak ?? 0;
        const newBestStreak = Math.max(currentBest, newStreak);

        set({
          tasks: state.tasks.map(t => ({ ...t, status: 'pending' as const, completedAt: undefined })),
          dayEnded: false,
          user: {
            ...state.user,
            lastActive: today,
            streak: newStreak,
            bestStreak: newBestStreak,
            history: newHistory,
          },
        });
      },

      completeMorningRitual: () => set((state) => ({
        user: {
          ...state.user,
          morningRitualDate: getToday(),
        },
      })),

      endDay: (note) => set((state) => {
        const today = getToday();
        const record = snapshotDay(state.tasks, today, note);
        const history = migrateHistory(state.user.history);
        const filtered = history.filter(r => r.date !== today);

        // Save the snapshot but do NOT reset tasks — they stay visible
        // until initializeDay resets them on the next day
        return {
          dayEnded: true,
          user: {
            ...state.user,
            history: [...filtered, record],
          },
        };
      }),

      checkMilestones: () => {
        const state = get();
        const newlyUnlocked: string[] = [];

        const updatedMilestones = state.milestones.map(m => {
          if (m.unlockedAt) return m;

          let currentValue = 0;
          switch (m.type) {
            case 'streak': currentValue = state.user.streak; break;
            case 'level': currentValue = state.user.level; break;
            case 'xp': currentValue = state.user.xp; break;
            case 'tasks': currentValue = state.user.totalTasksCompleted ?? 0; break;
          }

          if (currentValue >= m.target) {
            newlyUnlocked.push(m.title);
            return { ...m, unlockedAt: new Date().toISOString() };
          }
          return m;
        });

        if (newlyUnlocked.length > 0) {
          set({ milestones: updatedMilestones });
        }

        return newlyUnlocked;
      },

      addObjective: (objective) => set((state) => ({
        objectives: [...state.objectives, objective],
      })),

      removeObjective: (id) => set((state) => ({
        objectives: state.objectives.filter(o => o.id !== id),
      })),

      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, {
          ...task,
          id: crypto.randomUUID(),
          status: 'pending' as const,
        }],
      })),

      removeTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id),
      })),

      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t),
      })),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings },
      })),
    }),
    {
      name: 'prosperity-storage',
      version: 3,
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as Record<string, unknown>;
        if (version < 2) {
          if (!state.settings) {
            state.settings = {
              soundEnabled: true,
              notificationsEnabled: false,
              pomodoroWork: 25,
              pomodoroShortBreak: 5,
              pomodoroLongBreak: 15,
            };
          }
          const user = state.user as Record<string, unknown> | undefined;
          if (user) {
            if (user.bestStreak === undefined) {
              user.bestStreak = (user.streak as number) || 0;
            }
            if (!Array.isArray(user.history)) {
              user.history = migrateHistory(user.history);
            }
          }
        }
        if (version < 3) {
          const user = state.user as Record<string, unknown> | undefined;
          if (user) {
            if (user.morningRitualDate === undefined) user.morningRitualDate = '';
            if (user.totalTasksCompleted === undefined) user.totalTasksCompleted = 0;
          }
          if (!state.milestones) {
            state.milestones = DEFAULT_MILESTONES;
          }
        }
        return state as unknown as AppState;
      },
    }
  )
);
