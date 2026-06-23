import clsx from 'clsx';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, message, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-60">
      <div className="absolute inset-0 bg-text/20 backdrop-blur-[2px]" onClick={onCancel} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className={clsx('bg-surface border border-border-light rounded-xl shadow-lg w-full max-w-md') }>
          <div className="flex items-start justify-between px-5 py-4 border-b border-border-light">
            <div>
              <h3 className="text-lg font-semibold">{title || 'Confirm'}</h3>
              {message && <p className="text-sm text-text-secondary mt-1">{message}</p>}
            </div>
            <button onClick={onCancel} className="p-2 rounded-lg hover:bg-border-light text-text-muted">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="px-5 py-4 flex justify-end gap-3">
            <Button variant="secondary" onClick={onCancel}>Cancel</Button>
            <Button variant="danger" onClick={onConfirm}>Delete</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
