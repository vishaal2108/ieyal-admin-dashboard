import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import clsx from 'clsx';
import { useToast, type ToastType } from '../../hooks/useToast';

const icons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles: Record<ToastType, string> = {
  success: 'border-success/30 bg-success-light/80',
  error: 'border-danger/30 bg-danger-light/80',
  warning: 'border-warning/30 bg-warning-light/80',
  info: 'border-primary/30 bg-primary-light/80',
};

const iconColors: Record<ToastType, string> = {
  success: 'text-success',
  error: 'text-danger',
  warning: 'text-warning',
  info: 'text-primary',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={clsx(
              'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm shadow-lg animate-toast-in min-w-[280px] max-w-sm',
              styles[toast.type]
            )}
          >
            <Icon className={clsx('w-5 h-5 shrink-0', iconColors[toast.type])} />
            <p className="text-sm font-medium text-text flex-1">{toast.message}</p>
            {toast.action && toast.actionLabel ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    try {
                      toast.action && toast.action();
                    } catch (e) {
                      // ignore
                    }
                    removeToast(toast.id);
                  }}
                  className="text-primary font-medium text-sm hover:underline transition-colors cursor-pointer"
                >
                  {toast.actionLabel}
                </button>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-text-muted hover:text-text transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => removeToast(toast.id)}
                className="text-text-muted hover:text-text transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  width?: 'md' | 'lg' | 'xl';
}

const widths = {
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export function Drawer({ open, onClose, children, title, width = 'lg' }: DrawerProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-text/20 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />
      <div
        className={clsx(
          'absolute right-0 top-0 h-full w-full bg-surface shadow-drawer animate-slide-in-right flex flex-col',
          widths[width]
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-light shrink-0">
            <h2 className="text-lg font-semibold font-display text-text">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-border-light text-text-muted hover:text-text transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
