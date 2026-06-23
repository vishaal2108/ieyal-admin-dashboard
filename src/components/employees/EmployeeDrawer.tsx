import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Building2,
  Briefcase,
  User,
  Clock,
} from 'lucide-react';
import { Drawer } from '../ui/Drawer';
import { Avatar } from '../ui/Avatar';
import { Badge, statusBadgeVariant, accessBadgeVariant, formatLabel } from '../ui/Badge';
import type { Employee } from '../../types/employee';

interface EmployeeDrawerProps {
  employee: Employee | null;
  open: boolean;
  onClose: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function EmployeeDrawer({ employee, open, onClose }: EmployeeDrawerProps) {
  if (!employee) return null;

  const fullName = `${employee.firstName} ${employee.lastName}`;

  return (
    <Drawer open={open} onClose={onClose} width="lg">
      <div className="flex flex-col h-full">
        <div className="relative bg-gradient-to-br from-primary/5 via-accent/5 to-background px-6 pt-8 pb-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/60 text-text-muted hover:text-text transition-colors cursor-pointer lg:hidden"
          >
            ✕
          </button>
          <div className="flex items-start gap-4">
            <Avatar name={fullName} size="xl" />
            <div className="flex-1 min-w-0 pt-1">
              <h2 className="font-display text-xl font-bold text-text">{fullName}</h2>
              <p className="text-sm text-text-secondary mt-0.5">{employee.designation}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant={statusBadgeVariant(employee.status)} dot>
                  {formatLabel(employee.status)}
                </Badge>
                <Badge variant={accessBadgeVariant(employee.accessLevel)}>
                  {formatLabel(employee.accessLevel)} Access
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
              Contact Information
            </h3>
            <div className="space-y-3">
              <InfoRow icon={Mail} label="Email" value={employee.email} />
              <InfoRow icon={Phone} label="Phone" value={employee.phone} />
              <InfoRow icon={MapPin} label="Location" value={employee.location} />
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
              Organization
            </h3>
            <div className="space-y-3">
              <InfoRow icon={Building2} label="Department" value={employee.department} />
              <InfoRow icon={Briefcase} label="Designation" value={employee.designation} />
              {employee.manager && (
                <InfoRow icon={User} label="Reports To" value={employee.manager} />
              )}
              <InfoRow icon={Calendar} label="Join Date" value={formatDate(employee.joinDate)} />
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
              Access Details
            </h3>
            <div className="bg-border-light/50 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-text capitalize">
                  {employee.accessLevel} Level
                </span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                {getAccessDescription(employee.accessLevel)}
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
              Activity History
            </h3>
            <div className="space-y-0">
              {employee.activity.map((entry, i) => (
                <div key={entry.id} className="flex gap-3 relative">
                  {i < employee.activity.length - 1 && (
                    <div className="absolute left-[7px] top-6 bottom-0 w-px bg-border" />
                  )}
                  <div className="w-3.5 h-3.5 rounded-full bg-primary-light border-2 border-primary shrink-0 mt-1" />
                  <div className="pb-4 flex-1">
                    <p className="text-sm font-medium text-text">{entry.action}</p>
                    {entry.details && (
                      <p className="text-xs text-text-secondary mt-0.5">{entry.details}</p>
                    )}
                    <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDateTime(entry.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Drawer>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-border-light flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-text-muted" />
      </div>
      <div>
        <p className="text-xs text-text-muted">{label}</p>
        <p className="text-sm font-medium text-text">{value}</p>
      </div>
    </div>
  );
}

function getAccessDescription(level: string): string {
  switch (level) {
    case 'admin':
      return 'Full system access including user management, permissions, and all organizational settings.';
    case 'manager':
      return 'Team management access including employee records, approvals, and department-level reports.';
    case 'employee':
      return 'Standard employee access to personal profile, leave requests, and team directory.';
    case 'viewer':
      return 'Read-only access to public directory and approved organizational information.';
    default:
      return 'Standard access level.';
  }
}
