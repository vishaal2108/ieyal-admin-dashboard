import { TrendingUp, TrendingDown, Users, UserCheck, UserX, Shield } from 'lucide-react';
import clsx from 'clsx';
import { AnimatedCounter } from '../ui/AnimatedCounter';

interface StatCardProps {
  title: string;
  value: number;
  change: number;
  icon: typeof Users;
  iconBg: string;
  iconColor: string;
  suffix?: string;
  delay?: number;
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconBg,
  iconColor,
  suffix,
  delay = 0,
}: StatCardProps) {
  const isPositive = change >= 0;

  return (
    <div
      className="bg-surface rounded-xl border border-border-light p-5 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 animate-fade-in group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <p className="text-3xl font-bold font-display text-text tracking-tight">
            <AnimatedCounter value={value} suffix={suffix} />
          </p>
          <div className="flex items-center gap-1.5">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-success" />
            ) : (
              <TrendingDown className="w-4 h-4 text-danger" />
            )}
            <span
              className={clsx(
                'text-xs font-semibold',
                isPositive ? 'text-success' : 'text-danger'
              )}
            >
              {isPositive ? '+' : ''}
              {change}%
            </span>
            <span className="text-xs text-text-muted">vs last month</span>
          </div>
        </div>
        <div
          className={clsx(
            'p-3 rounded-xl transition-transform duration-300 group-hover:scale-110',
            iconBg
          )}
        >
          <Icon className={clsx('w-5 h-5', iconColor)} />
        </div>
      </div>
    </div>
  );
}

interface StatsGridProps {
  total: number;
  active: number;
  inactive: number;
  admins: number;
}

export function StatsGrid({ total, active, inactive, admins }: StatsGridProps) {
  const activePercent = total > 0 ? Math.round((active / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Employees"
        value={total}
        change={8.2}
        icon={Users}
        iconBg="bg-primary-light"
        iconColor="text-primary"
        delay={0}
      />
      <StatCard
        title="Active Employees"
        value={active}
        change={5.4}
        icon={UserCheck}
        iconBg="bg-success-light"
        iconColor="text-success"
        suffix={` (${activePercent}%)`}
        delay={80}
      />
      <StatCard
        title="Inactive / On Leave"
        value={inactive}
        change={-2.1}
        icon={UserX}
        iconBg="bg-warning-light"
        iconColor="text-warning"
        delay={160}
      />
      <StatCard
        title="Admin Access"
        value={admins}
        change={0}
        icon={Shield}
        iconBg="bg-accent-light"
        iconColor="text-accent"
        delay={240}
      />
    </div>
  );
}
