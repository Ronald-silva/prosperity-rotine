import { useStore } from '../../store/useStore';
import { Bell, Flame, Trophy } from 'lucide-react';

export function Header() {
  const { user } = useStore();

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm fixed top-0 right-0 left-64 z-10 flex items-center justify-between px-8">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-foreground">
          Bem-vindo, Guerreiro
        </h2>
      </div>

      <div className="flex items-center gap-6">
        {/* Streak */}
        <div className="flex items-center gap-2 text-orange-500 bg-orange-500/10 px-3 py-1.5 rounded-full">
          <Flame className="w-4 h-4 fill-current" />
          <span className="text-sm font-bold">{user.streak} Dias</span>
        </div>

        {/* Level */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Nível {user.level}</p>
            <div className="w-24 h-2 bg-secondary rounded-full mt-1 overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(user.xp % 1000) / 10}%` }}
              />
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <Trophy className="w-5 h-5" />
          </div>
        </div>

        <button className="relative ml-2 text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-card" />
        </button>
      </div>
    </header>
  );
}
