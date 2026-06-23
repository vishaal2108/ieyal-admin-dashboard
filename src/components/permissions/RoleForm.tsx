import { useEffect, useState } from 'react';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import type { Role } from '../../types/permission';

interface RoleFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (role: Role) => void;
  initial?: Role | null;
}

const defaultPerms = ['read:employees', 'write:employees', 'delete:employees', 'manage:roles'];

export function RoleForm({ open, onClose, onSave, initial }: RoleFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [perms, setPerms] = useState<string[]>([]);

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setDescription(initial.description || '');
      setPerms(initial.permissions || []);
    } else {
      setName('');
      setDescription('');
      setPerms([]);
    }
  }, [initial, open]);

  const togglePerm = (p: string) => {
    setPerms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const id = initial ? initial.id : `role-${Date.now()}`;
    onSave({ id, name: name.trim() || 'Unnamed Role', description: description.trim(), permissions: perms });
    onClose();
  };

  return (
    <Drawer open={open} onClose={onClose} title={initial ? 'Edit Role' : 'Add Role'} width="md">
      <form onSubmit={handleSave} className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Role Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="Manager"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Description</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="Can manage employees and teams"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">Permissions</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {defaultPerms.map((p) => (
              <label key={p} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={perms.includes(p)} onChange={() => togglePerm(p)} />
                <span className="text-text-secondary">{p}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border-light">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save Role</Button>
        </div>
      </form>
    </Drawer>
  );
}
