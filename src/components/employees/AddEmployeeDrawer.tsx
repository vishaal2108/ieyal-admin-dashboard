import { useState, useEffect } from 'react';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import type { Employee, AccessLevel, EmployeeStatus } from '../../types/employee';
import {
  departmentOptions,
  designationOptions,
  accessLevelOptions,
  statusOptions,
} from '../../data/employees';

interface AddEmployeeDrawerProps {
  open: boolean;
  onClose: () => void;
  onAdd: (employee: Omit<Employee, 'id' | 'activity'>) => void;
  onUpdate?: (id: string, data: Omit<Employee, 'id' | 'activity'>) => void;
  initialData?: Employee | null;
}

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  designation: '',
  department: '',
  status: 'active' as EmployeeStatus,
  accessLevel: 'employee' as AccessLevel,
  joinDate: new Date().toISOString().split('T')[0],
  location: 'Bangalore',
};

export function AddEmployeeDrawer({ open, onClose, onAdd, onUpdate, initialData }: AddEmployeeDrawerProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // populate form when editing
  useEffect(() => {
    if (initialData && open) {
      setForm({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        phone: initialData.phone,
        designation: initialData.designation,
        department: initialData.department,
        status: initialData.status,
        accessLevel: initialData.accessLevel,
        joinDate: initialData.joinDate,
        location: initialData.location || 'Bangalore',
      });
    } else if (!open) {
      setForm(emptyForm);
    }
  }, [initialData, open]);

  const update = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.department) e.department = 'Required';
    if (!form.designation) e.designation = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    if (initialData && onUpdate) {
      onUpdate(initialData.id, {
        ...form,
        manager: initialData.manager,
      });
    } else {
      onAdd({
        ...form,
        manager: undefined,
      });
    }
    setForm(emptyForm);
    setSubmitting(false);
    onClose();
  };

  const handleClose = () => {
    setForm(emptyForm);
    setErrors({});
    onClose();
  };

  return (
    <Drawer open={open} onClose={handleClose} title={initialData ? 'Edit Employee' : 'Add New Employee'} width="lg">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <p className="text-sm text-text-secondary -mt-2">
          Fill in the details below to onboard a new team member.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First Name" error={errors.firstName} required>
            <input
              value={form.firstName}
              onChange={(e) => update('firstName', e.target.value)}
              className={inputClass(errors.firstName)}
              placeholder="John"
            />
          </Field>
          <Field label="Last Name" error={errors.lastName} required>
            <input
              value={form.lastName}
              onChange={(e) => update('lastName', e.target.value)}
              className={inputClass(errors.lastName)}
              placeholder="Doe"
            />
          </Field>
        </div>

        <Field label="Email Address" error={errors.email} required>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className={inputClass(errors.email)}
            placeholder="john.doe@ieyal.com"
          />
        </Field>

        <Field label="Phone Number">
          <input
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            className={inputClass()}
            placeholder="+91 98765 43210"
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Department" error={errors.department} required>
            <select
              value={form.department}
              onChange={(e) => update('department', e.target.value)}
              className={inputClass(errors.department)}
            >
              <option value="">Select department</option>
              {departmentOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Designation" error={errors.designation} required>
            <select
              value={form.designation}
              onChange={(e) => update('designation', e.target.value)}
              className={inputClass(errors.designation)}
            >
              <option value="">Select designation</option>
              {designationOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => update('status', e.target.value)}
              className={inputClass()}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/-/g, ' ')}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Access Level">
            <select
              value={form.accessLevel}
              onChange={(e) => update('accessLevel', e.target.value)}
              className={inputClass()}
            >
              {accessLevelOptions.map((a) => (
                <option key={a} value={a}>
                  {a.charAt(0).toUpperCase() + a.slice(1)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Join Date">
            <input
              type="date"
              value={form.joinDate}
              onChange={(e) => update('joinDate', e.target.value)}
              className={inputClass()}
            />
          </Field>
        </div>

        <Field label="Location">
          <input
            value={form.location}
            onChange={(e) => update('location', e.target.value)}
            className={inputClass()}
            placeholder="Bangalore"
          />
        </Field>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-light">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            {initialData ? 'Save Changes' : 'Add Employee'}
          </Button>
        </div>
      </form>
    </Drawer>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-text mb-1.5">
        {label}
        {required && <span className="text-danger ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
    </div>
  );
}

function inputClass(error?: string) {
  return `w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
    error ? 'border-danger' : 'border-border'
  }`;
}
