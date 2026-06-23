import { Edit3, Trash2, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Role } from '../../types/permission';
import clsx from 'clsx';

interface RoleListProps {
  roles: Role[];
  onEdit: (r: Role) => void;
  onDelete: (id: string) => void;
}

export function RoleList({ roles, onEdit, onDelete }: RoleListProps) {
  return (
    <div className="bg-surface rounded-xl border border-border-light p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold">Roles</h3>
      </div>
      <div className="space-y-3">
        {roles.length === 0 ? (
          <p className="text-sm text-text-secondary">No roles created yet.</p>
        ) : (
          roles.map((r) => (
            <div key={r.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <p className="font-medium text-text">{r.name}</p>
                <p className="text-sm text-text-secondary">{r.description}</p>
                <p className="text-xs text-text-muted mt-2">{r.permissions.join(', ')}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit(r)}>
                  <Edit3 className="w-4 h-4" /> Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => onDelete(r.id)}>
                  <Trash2 className="w-4 h-4" /> Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
