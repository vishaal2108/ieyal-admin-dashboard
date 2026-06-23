import { Bell, Menu, Plus } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

interface TopNavProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
  onAddEmployee: () => void;
  onSearchFocus: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function TopNav({
  title,
  subtitle,
  onMenuClick,
  onAddEmployee,
  onSearchFocus,
  searchValue,
  onSearchChange,
}: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md border-b border-border-light">
      <div className="flex items-center justify-between h-16 px-6 gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-border-light text-text-secondary transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="font-display text-xl font-bold text-text truncate">{title}</h1>
            {subtitle && (
              <p className="text-sm text-text-secondary truncate hidden sm:block">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={onAddEmployee} size="md" className="hidden sm:inline-flex">
            <Plus className="w-4 h-4" />
            Add Employee
          </Button>
          <Button onClick={onAddEmployee} size="sm" className="sm:hidden">
            <Plus className="w-4 h-4" />
          </Button>

          <button className="relative p-2 rounded-lg hover:bg-border-light text-text-secondary transition-colors cursor-pointer">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full ring-2 ring-surface" />
          </button>

          <div className="flex items-center gap-3 pl-3 border-l border-border-light">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-text">Admin User</p>
              <p className="text-xs text-text-muted">admin@ieyal.com</p>
            </div>
            <Avatar name="Admin User" size="md" />
          </div>
        </div>
      </div>
    </header>
  );
}
