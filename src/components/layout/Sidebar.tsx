import {
  LayoutDashboard,
  Users,
  Shield,
  BarChart3,
  Settings,
  HelpCircle,
  Building2,
} from 'lucide-react';
import clsx from 'clsx';

export type NavItem = 'dashboard' | 'employees' | 'permissions' | 'analytics' | 'settings';

interface SidebarProps {
  active: NavItem;
  onNavigate: (item: NavItem) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const navItems: { id: NavItem; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'employees', label: 'Employees', icon: Users },
  { id: 'permissions', label: 'Permissions', icon: Shield },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ active, onNavigate, collapsed }: SidebarProps) {
  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 h-screen bg-surface border-r border-border-light z-40 flex flex-col transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      <div className="flex items-center gap-3 px-5 h-16 border-b border-border-light shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-display font-bold text-text text-sm leading-tight">IEYAL People</h1>
            <p className="text-[10px] text-text-muted leading-tight">Solutions Pvt. Ltd.</p>
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Main Menu
          </p>
        )}
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={clsx(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer group',
              active === id
                ? 'bg-primary-light text-primary'
                : 'text-text-secondary hover:bg-border-light hover:text-text'
            )}
            title={collapsed ? label : undefined}
          >
            <Icon
              className={clsx(
                'w-5 h-5 shrink-0 transition-colors',
                active === id ? 'text-primary' : 'text-text-muted group-hover:text-text-secondary'
              )}
            />
            {!collapsed && <span>{label}</span>}
            {active === id && !collapsed && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
            )}
          </button>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-border-light">
        <button
          className={clsx(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-border-light hover:text-text transition-all duration-200 cursor-pointer'
          )}
        >
          <HelpCircle className="w-5 h-5 text-text-muted shrink-0" />
          {!collapsed && <span>Help & Support</span>}
        </button>
      </div>
    </aside>
  );
}
