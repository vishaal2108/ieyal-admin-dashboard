import { useState, useEffect, useCallback, useRef } from 'react';
import { ToastProvider, useToast } from './hooks/useToast';
import { ToastContainer } from './components/ui/Drawer';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Sidebar, type NavItem } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { ConfirmDialog } from './components/ui/ConfirmDialog';
import { PermissionsPage } from './components/permissions/PermissionsPage';
import { StatsGrid } from './components/dashboard/StatCards';
import { AnalyticsCharts } from './components/dashboard/AnalyticsCharts';
import { EmployeeTable } from './components/employees/EmployeeTable';
import { EmployeeDrawer } from './components/employees/EmployeeDrawer';
import { AddEmployeeDrawer } from './components/employees/AddEmployeeDrawer';
import { DashboardSkeleton } from './components/ui/Skeleton';
import { initialEmployees } from './data/employees';
import type { Employee } from './types/employee';

function AppContent() {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const raw = localStorage.getItem('ieyal_employees');
      if (raw) return JSON.parse(raw) as Employee[];
    } catch (e) {
      // ignore parse errors
    }
    return initialEmployees;
  });
  const [activeNav, setActiveNav] = useState<NavItem>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // persist employees to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ieyal_employees', JSON.stringify(employees));
    } catch (e) {
      // ignore
    }
  }, [employees]);

  const handleViewEmployee = useCallback((employee: Employee) => {
    setSelectedEmployee(employee);
    setDrawerOpen(true);
  }, []);

  const handleDeleteEmployees = useCallback(
    (ids: string[]) => {
      const toRemove = employees.filter((e) => ids.includes(e.id));
      setEmployees((prev) => prev.filter((e) => !ids.includes(e.id)));
      if (toRemove.length === 0) return;
      addToast(`${toRemove.length} employee(s) removed`, 'success', {
        label: 'Undo',
        onClick: () => {
          setEmployees((prev) => {
            // restore removed items at the start
            const restored = [...toRemove, ...prev];
            // dedupe by id
            const map = new Map<string, Employee>();
            for (const e of restored) map.set(e.id, e);
            return Array.from(map.values());
          });
          addToast('Restore completed', 'info');
        },
      });
    },
    [employees, addToast]
  );

  const handleAddEmployee = useCallback(
    (data: Omit<Employee, 'id' | 'activity'>) => {
      const newEmployee: Employee = {
        ...data,
        id: `emp-${String(employees.length + 1).padStart(3, '0')}`,
        activity: [
          {
            id: 'act-new',
            action: 'Account created',
            details: 'Added by administrator',
            timestamp: new Date().toISOString(),
          },
        ],
      };
      setEmployees((prev) => [newEmployee, ...prev]);
      addToast(`${data.firstName} ${data.lastName} added successfully`, 'success');
    },
    [employees.length, addToast]
  );

    const handleUpdateEmployee = useCallback(
      (id: string, data: Omit<Employee, 'id' | 'activity'>) => {
        setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)));
        addToast('Employee updated successfully', 'success');
      },
      [addToast]
    );

    const handleEditEmployee = useCallback((employee: Employee) => {
      setEditingEmployee((prev) => {
        // prefer the canonical employee object from state when available
        const fromState = employees.find((e) => e.id === employee.id);
        return fromState ?? employee;
      });
      setAddDrawerOpen(true);
    }, [employees]);

    // delete confirmation
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingDeleteIds, setPendingDeleteIds] = useState<string[] | null>(null);

    const handleDeleteRequest = useCallback((ids: string[]) => {
      setPendingDeleteIds(ids);
      setConfirmOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(() => {
      if (pendingDeleteIds) {
        handleDeleteEmployees(pendingDeleteIds);
      }
      setPendingDeleteIds(null);
      setConfirmOpen(false);
    }, [pendingDeleteIds, handleDeleteEmployees]);

    const handleCancelDelete = useCallback(() => {
      setPendingDeleteIds(null);
      setConfirmOpen(false);
    }, []);

  const stats = {
    total: employees.length,
    active: employees.filter((e) => e.status === 'active').length,
    inactive: employees.filter((e) => e.status !== 'active').length,
    admins: employees.filter((e) => e.accessLevel === 'admin').length,
  };

  const navTitles: Record<NavItem, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Overview of your organization at IEYAL Solutions',
    },
    employees: {
      title: 'Employees',
      subtitle: 'Manage your team members and their access',
    },
    permissions: {
      title: 'Permissions',
      subtitle: 'Configure access levels and role-based permissions',
    },
    analytics: {
      title: 'Analytics',
      subtitle: 'Workforce insights and organizational metrics',
    },
    settings: {
      title: 'Settings',
      subtitle: 'Configure your IEYAL People workspace',
    },
  };

  const { title, subtitle } = navTitles[activeNav];

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const downloadCSV = (filename: string, csv: string) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const exportCSV = useCallback((ids?: string[]) => {
    const rows = (ids && ids.length > 0 ? employees.filter((e) => ids.includes(e.id)) : employees).map((e) => ({
      id: e.id,
      firstName: e.firstName,
      lastName: e.lastName,
      email: e.email,
      phone: e.phone,
      designation: e.designation,
      department: e.department,
      status: e.status,
      accessLevel: e.accessLevel,
      joinDate: e.joinDate,
      location: e.location,
      manager: e.manager || '',
    }));
    if (rows.length === 0) {
      addToast('No employees to export', 'warning');
      return;
    }
    const headers = Object.keys(rows[0]);
    const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => `"${String((r as any)[h] ?? '').replace(/"/g, '""')}"`).join(','))].join('\n');
    downloadCSV('employees.csv', csv);
    addToast('Export completed', 'success');
  }, [employees, addToast]);

  const triggerImport = useCallback(() => {
    if (fileInputRef.current) fileInputRef.current.click();
  }, []);

  const handleImportFile = useCallback((file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      const lines = text.split(/\r?\n/).filter((l) => l.trim());
      if (lines.length < 2) {
        addToast('No data found in CSV', 'warning');
        return;
      }
      const headers = lines[0].split(',').map((h) => h.replace(/"/g, '').trim());
      const parsed: Employee[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map((c) => c.replace(/^"|"$/g, ''));
        if (cols.length !== headers.length) continue;
        const obj: any = {};
        for (let j = 0; j < headers.length; j++) obj[headers[j]] = cols[j];
        const newEmp: Employee = {
          id: obj.id || `imp-${Date.now()}-${i}`,
          firstName: obj.firstName || obj.first || '',
          lastName: obj.lastName || obj.last || '',
          email: obj.email || '',
          phone: obj.phone || '',
          designation: obj.designation || '',
          department: obj.department || '',
          status: (obj.status as any) || 'active',
          accessLevel: (obj.accessLevel as any) || 'employee',
          joinDate: obj.joinDate || new Date().toISOString().split('T')[0],
          location: obj.location || '',
          manager: obj.manager || undefined,
          activity: [],
        };
        parsed.push(newEmp);
      }
      if (parsed.length === 0) {
        addToast('No valid rows in CSV', 'warning');
        return;
      }
      setEmployees((prev) => {
        // avoid id collisions
        const existingIds = new Set(prev.map((p) => p.id));
        const toAdd = parsed.map((p) => {
          if (existingIds.has(p.id)) {
            p.id = `imp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
          }
          return p;
        });
        return [...toAdd, ...prev];
      });
      addToast(`${parsed.length} employee(s) imported`, 'success');
    };
    reader.readAsText(file);
  }, [addToast]);

  const renderContent = () => {
    if (loading) return <DashboardSkeleton />;

    switch (activeNav) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-fade-in">
            <StatsGrid {...stats} />
            <AnalyticsCharts employees={employees} />
            <EmployeeTable
              employees={employees.slice(0, 20)}
              onView={handleViewEmployee}
              onDeleteRequest={handleDeleteRequest}
              onEdit={handleEditEmployee}
              externalSearch={globalSearch}
              onExport={exportCSV}
              onImportTrigger={triggerImport}
            />
          </div>
        );
      case 'employees':
        return (
        <EmployeeTable
          employees={employees}
          onView={handleViewEmployee}
          onDeleteRequest={handleDeleteRequest}
          onEdit={handleEditEmployee}
          externalSearch={globalSearch}
          onExport={exportCSV}
          onImportTrigger={triggerImport}
        />
        );
      case 'analytics':
        return (
          <div className="space-y-6 animate-fade-in">
            <StatsGrid {...stats} />
            <AnalyticsCharts employees={employees} />
          </div>
        );
      case 'permissions':
        return <PermissionsPage />;
      case 'settings':
        return (
          <div className="bg-surface rounded-xl border border-border-light p-8 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚙️</span>
            </div>
            <h2 className="font-display text-xl font-bold text-text mb-2">Workspace Settings</h2>
            <p className="text-text-secondary max-w-md mx-auto">
              Customize your IEYAL People workspace, manage integrations, and configure
              organization preferences.
            </p>
          </div>
        );
    }
  };

  return (
    <>
      <DashboardLayout
        sidebarCollapsed={sidebarCollapsed}
        sidebar={
          <Sidebar
            active={activeNav}
            onNavigate={setActiveNav}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
          />
        }
        topNav={
          <TopNav
            title={title}
            subtitle={subtitle}
            onMenuClick={() => setSidebarCollapsed((c) => !c)}
            onAddEmployee={() => {
              setEditingEmployee(null);
              setAddDrawerOpen(true);
            }}
            onSearchFocus={() => setActiveNav('employees')}
            searchValue={globalSearch}
            onSearchChange={setGlobalSearch}
          />
        }
      >
        {renderContent()}
      </DashboardLayout>

      <EmployeeDrawer
        employee={selectedEmployee}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <AddEmployeeDrawer
        open={addDrawerOpen}
        onClose={() => {
          setAddDrawerOpen(false);
          setEditingEmployee(null);
        }}
        onAdd={handleAddEmployee}
        onUpdate={handleUpdateEmployee}
        initialData={editingEmployee}
      />

      <input
        ref={(r) => (fileInputRef.current = r)}
        type="file"
        accept=".csv,text/csv"
        onChange={(e) => handleImportFile(e.target.files ? e.target.files[0] : null)}
        style={{ display: 'none' }}
      />

      {/* Confirm dialog for deletions */}
      {/** Lazy import / local include of ConfirmDialog */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete employee(s)"
        message="Are you sure you want to delete the selected employee(s)? This action can be undone via the toast within a few seconds."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <ToastContainer />
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
