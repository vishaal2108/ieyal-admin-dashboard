import { useCallback, useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { RoleForm } from './RoleForm';
import { RoleList } from './RoleList';
import type { Role } from '../../types/permission';
import { useToast } from '../../hooks/useToast';
import { ConfirmDialog } from '../ui/ConfirmDialog';

export function PermissionsPage() {
  const [roles, setRoles] = useState<Role[]>(() => {
    try {
      const raw = localStorage.getItem('ieyal_roles');
      if (raw) return JSON.parse(raw) as Role[];
    } catch (e) {}
    return [];
  });
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('ieyal_roles', JSON.stringify(roles));
    } catch (e) {}
  }, [roles]);

  const handleSave = useCallback((role: Role) => {
    setRoles((prev) => {
      const exists = prev.find((p) => p.id === role.id);
      if (exists) return prev.map((p) => (p.id === role.id ? role : p));
      return [role, ...prev];
    });
    addToast('Role saved', 'success');
  }, [addToast]);

  const handleEdit = useCallback((r: Role) => {
    setEditing(r);
    setOpenForm(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setPendingDelete(id);
    setConfirmOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!pendingDelete) return;
    setRoles((prev) => prev.filter((r) => r.id !== pendingDelete));
    setPendingDelete(null);
    setConfirmOpen(false);
    addToast('Role deleted', 'info');
  }, [pendingDelete, addToast]);

  const cancelDelete = useCallback(() => {
    setPendingDelete(null);
    setConfirmOpen(false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-text">Permission Management</h2>
          <p className="text-sm text-text-secondary">Create and manage roles and their permissions.</p>
        </div>
        <div>
          <Button onClick={() => { setEditing(null); setOpenForm(true); }}>Add Role</Button>
        </div>
      </div>

      <RoleList roles={roles} onEdit={handleEdit} onDelete={handleDelete} />

      <RoleForm open={openForm} onClose={() => setOpenForm(false)} onSave={handleSave} initial={editing} />

      <ConfirmDialog open={confirmOpen} title="Delete role" message="Delete this role?" onConfirm={confirmDelete} onCancel={cancelDelete} />
    </div>
  );
}
