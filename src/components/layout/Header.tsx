import { useStore } from '../../store/useStore';
import { Flame, Trophy } from 'lucide-react';

export function Header() {
  const { user } = useStore();

  return (
    <header className="h-14 lg:h-16 border-b border-border bg-card/50 backdrop-blur-sm fixed top-0 left-0 lg:left-64 right-0 z-10 flex items-center justify-between px-4 lg:px-8">
      {/* Mobile brand + Desktop greeting */}
      <div className="flex items-center gap-3 min-w-0">
        <h2 className="text-base lg:text-lg font-semibold text-foreground truncate">
          <span className="lg:hidden bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Prosperity.</span>
          <span className="hidden lg:inline">Bem-vindo, Guerreiro</span>
        </h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 shrink-0">
        {/* Streak */}
        <div className="flex items-center gap-1.5 text-orange-500 bg-orange-500/10 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full">
          <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
          <span className="text-xs sm:text-sm font-bold">{user.streak}</span>
        </div>

        {/* Level */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-muted-foreground">Nível {user.level}</p>
            <div className="w-20 lg:w-24 h-2 bg-secondary rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(user.xp % 1000) / 10}%` }}
              />
            </div>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
