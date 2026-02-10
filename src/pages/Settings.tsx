import { useState } from 'react';
import { useStore, type TaskCategory } from '../store/useStore';
import { requestNotificationPermission, playTaskComplete } from '../lib/sounds';
import { Plus, Trash2, Pencil, Check, X, Volume2, Bell } from 'lucide-react';
import * as Switch from '@radix-ui/react-switch';
import * as Slider from '@radix-ui/react-slider';

const CATEGORY_OPTIONS: { value: TaskCategory; label: string; color: string }[] = [
  { value: 'core', label: 'Núcleo Obrigatório', color: 'bg-red-500' },
  { value: 'technical', label: 'Desenvolvimento Técnico', color: 'bg-blue-500' },
  { value: 'expansion', label: 'Expansão Mental', color: 'bg-green-500' },
  { value: 'passive', label: 'Aprendizado Passivo', color: 'bg-slate-500' },
  { value: 'spiritual', label: 'Disciplina Espiritual', color: 'bg-purple-500' },
  { value: 'strategic', label: 'Estratégico', color: 'bg-amber-500' },
];

function getCategoryColor(cat: TaskCategory): string {
  return CATEGORY_OPTIONS.find(c => c.value === cat)?.color ?? 'bg-slate-500';
}

function getCategoryLabel(cat: TaskCategory): string {
  return CATEGORY_OPTIONS.find(c => c.value === cat)?.label ?? cat;
}

export function Settings() {
  const { tasks, settings, addTask, removeTask, updateTask, updateSettings } = useStore();

  // Add task form
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TaskCategory>('core');
  const [newXP, setNewXP] = useState(50);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<TaskCategory>('core');
  const [editXP, setEditXP] = useState(50);

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addTask({ title: newTitle.trim(), category: newCategory, xpReward: newXP });
    setNewTitle('');
    setNewCategory('core');
    setNewXP(50);
    setShowAdd(false);
  };

  const startEdit = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    setEditingId(id);
    setEditTitle(task.title);
    setEditCategory(task.category);
    setEditXP(task.xpReward);
  };

  const saveEdit = () => {
    if (!editingId || !editTitle.trim()) return;
    updateTask(editingId, { title: editTitle.trim(), category: editCategory, xpReward: editXP });
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestNotificationPermission();
      updateSettings({ notificationsEnabled: granted });
    } else {
      updateSettings({ notificationsEnabled: false });
    }
  };

  const handleSoundToggle = (enabled: boolean) => {
    updateSettings({ soundEnabled: enabled });
    if (enabled) playTaskComplete();
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Configurações
        </h1>
        <p className="text-muted-foreground mt-1">Personalize sua rotina de prosperidade</p>
      </div>

      {/* Tasks Section */}
      <section className="bg-card/50 border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Tarefas Diárias</h2>
            <p className="text-sm text-muted-foreground">Gerencie suas tarefas e recompensas XP</p>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        </div>

        {/* Add Form */}
        {showAdd && (
          <div className="mb-6 p-4 bg-secondary/50 rounded-lg border border-border space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <input
              type="text"
              placeholder="Nome da tarefa"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-3">
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as TaskCategory)}
                className="flex-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {CATEGORY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={newXP}
                  onChange={e => setNewXP(Number(e.target.value))}
                  className="w-20 px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground text-center focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm text-muted-foreground">XP</span>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAdd}
                disabled={!newTitle.trim()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Criar Tarefa
              </button>
            </div>
          </div>
        )}

        {/* Task List */}
        <div className="space-y-1">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors group">
              {editingId === task.id ? (
                // Edit mode
                <>
                  <div className={`w-2 h-2 rounded-full ${getCategoryColor(editCategory)}`} />
                  <input
                    type="text"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && saveEdit()}
                    className="flex-1 px-2 py-1 bg-secondary border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                  />
                  <select
                    value={editCategory}
                    onChange={e => setEditCategory(e.target.value as TaskCategory)}
                    className="px-2 py-1 bg-secondary border border-border rounded text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {CATEGORY_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={editXP}
                    onChange={e => setEditXP(Number(e.target.value))}
                    className="w-16 px-2 py-1 bg-secondary border border-border rounded text-xs text-foreground text-center focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button onClick={saveEdit} className="p-1.5 text-green-400 hover:text-green-300">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={cancelEdit} className="p-1.5 text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                // View mode
                <>
                  <div className={`w-2 h-2 rounded-full ${getCategoryColor(task.category)}`} />
                  <span className="flex-1 text-sm text-foreground">{task.title}</span>
                  <span className="text-xs text-muted-foreground hidden sm:block">{getCategoryLabel(task.category)}</span>
                  <span className="text-xs font-mono text-primary">{task.xpReward} XP</span>
                  <button
                    onClick={() => startEdit(task.id)}
                    className="p-1.5 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeTask(task.id)}
                    className="p-1.5 text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Nenhuma tarefa configurada. Adicione sua primeira tarefa acima.
            </div>
          )}
        </div>
      </section>

      {/* Pomodoro Section */}
      <section className="bg-card/50 border border-border rounded-xl p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Pomodoro</h2>
          <p className="text-sm text-muted-foreground">Ajuste os tempos do modo foco</p>
        </div>

        <div className="space-y-5">
          {/* Work Duration */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tempo de Foco</span>
              <span className="font-mono text-foreground">{settings.pomodoroWork} min</span>
            </div>
            <Slider.Root
              value={[settings.pomodoroWork]}
              onValueChange={([v]) => updateSettings({ pomodoroWork: v })}
              min={5}
              max={60}
              step={5}
              className="relative flex items-center select-none touch-none w-full h-5"
            >
              <Slider.Track className="bg-secondary relative grow rounded-full h-1.5">
                <Slider.Range className="absolute bg-primary rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb className="block w-5 h-5 bg-primary rounded-full hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-lg" />
            </Slider.Root>
          </div>

          {/* Short Break */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Pausa Curta</span>
              <span className="font-mono text-foreground">{settings.pomodoroShortBreak} min</span>
            </div>
            <Slider.Root
              value={[settings.pomodoroShortBreak]}
              onValueChange={([v]) => updateSettings({ pomodoroShortBreak: v })}
              min={1}
              max={15}
              step={1}
              className="relative flex items-center select-none touch-none w-full h-5"
            >
              <Slider.Track className="bg-secondary relative grow rounded-full h-1.5">
                <Slider.Range className="absolute bg-green-500 rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb className="block w-5 h-5 bg-green-500 rounded-full hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 shadow-lg" />
            </Slider.Root>
          </div>

          {/* Long Break */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Pausa Longa</span>
              <span className="font-mono text-foreground">{settings.pomodoroLongBreak} min</span>
            </div>
            <Slider.Root
              value={[settings.pomodoroLongBreak]}
              onValueChange={([v]) => updateSettings({ pomodoroLongBreak: v })}
              min={5}
              max={30}
              step={5}
              className="relative flex items-center select-none touch-none w-full h-5"
            >
              <Slider.Track className="bg-secondary relative grow rounded-full h-1.5">
                <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb className="block w-5 h-5 bg-blue-500 rounded-full hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-lg" />
            </Slider.Root>
          </div>
        </div>
      </section>

      {/* Sound & Notifications Section */}
      <section className="bg-card/50 border border-border rounded-xl p-6 space-y-5">
        <div>
          <h2 className="text-lg font-semibold">Som & Notificações</h2>
          <p className="text-sm text-muted-foreground">Controle feedback sonoro e alertas</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Efeitos Sonoros</p>
              <p className="text-xs text-muted-foreground">Sons ao completar tarefas, level up e timer</p>
            </div>
          </div>
          <Switch.Root
            checked={settings.soundEnabled}
            onCheckedChange={handleSoundToggle}
            className="w-11 h-6 bg-secondary rounded-full relative data-[state=checked]:bg-primary transition-colors"
          >
            <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow transition-transform translate-x-0.5 data-[state=checked]:translate-x-[22px]" />
          </Switch.Root>
        </div>

        <div className="w-full h-px bg-border" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Notificações do Browser</p>
              <p className="text-xs text-muted-foreground">Alertas quando o timer finalizar</p>
            </div>
          </div>
          <Switch.Root
            checked={settings.notificationsEnabled}
            onCheckedChange={handleNotificationToggle}
            className="w-11 h-6 bg-secondary rounded-full relative data-[state=checked]:bg-primary transition-colors"
          >
            <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow transition-transform translate-x-0.5 data-[state=checked]:translate-x-[22px]" />
          </Switch.Root>
        </div>
      </section>
    </div>
  );
}
