import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Target, Zap, BarChart3, Settings, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Comando', to: '/' },
  { icon: Target, label: 'Estratégia', to: '/strategy' },
  { icon: Zap, label: 'Foco', to: '/focus' },
  { icon: BarChart3, label: 'Analytics', to: '/stats' },
  { icon: ShieldCheck, label: 'Anti-Proc.', to: '/anti-procrastination' },
];

export function Sidebar() {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-card border-r border-border h-screen flex-col fixed left-0 top-0 z-20">
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

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border">
        <div className="flex items-center justify-around px-1 py-1.5 safe-bottom">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-colors min-w-0",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-colors min-w-0",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )
            }
          >
            <Settings className="w-5 h-5" />
            <span className="truncate">Config</span>
          </NavLink>
        </div>
      </nav>
    </>
  );
}
