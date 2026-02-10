
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Target, Zap, BarChart3, Settings, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Sidebar() {
  const navItems = [
    { icon: LayoutDashboard, label: 'Comando', to: '/' },
    { icon: Target, label: 'Estratégia', to: '/strategy' },
    { icon: Zap, label: 'Foco Total', to: '/focus' },
    { icon: BarChart3, label: 'Analytics', to: '/stats' },
    { icon: ShieldCheck, label: 'Anti-Procrastinação', to: '/anti-procrastination' },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Prosperity.
        </h1>
        <p className="text-xs text-muted-foreground mt-1">Sistema Diário Ronald</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )
            }
          >
            <Settings className="w-5 h-5" />
            Configurações
          </NavLink>
      </div>
    </aside>
  );
}
