import clsx from 'clsx';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'primary' | 'accent';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  success: 'bg-success-light text-green-700',
  warning: 'bg-warning-light text-amber-700',
  danger: 'bg-danger-light text-red-700',
  neutral: 'bg-border-light text-text-secondary',
  primary: 'bg-primary-light text-primary',
  accent: 'bg-accent-light text-accent',
};

export function Badge({ children, variant = 'neutral', dot, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
        variants[variant],
        className
      )}
    >
      {dot && (
        <span
          className={clsx('w-1.5 h-1.5 rounded-full', {
            'bg-success': variant === 'success',
            'bg-warning': variant === 'warning',
            'bg-danger': variant === 'danger',
            'bg-text-muted': variant === 'neutral',
            'bg-primary': variant === 'primary',
            'bg-accent': variant === 'accent',
          })}
        />
      )}
      {children}
    </span>
  );
}

export function statusBadgeVariant(status: string): BadgeVariant {
  switch (status) {
    case 'active':
      return 'success';
    case 'inactive':
      return 'danger';
    case 'on-leave':
      return 'warning';
    default:
      return 'neutral';
  }
}

export function accessBadgeVariant(level: string): BadgeVariant {
  switch (level) {
    case 'admin':
      return 'accent';
    case 'manager':
      return 'primary';
    case 'employee':
      return 'success';
    case 'viewer':
      return 'neutral';
    default:
      return 'neutral';
  }
}

export function formatLabel(value: string): string {
  return value.replace(/-/g, ' ');
}
