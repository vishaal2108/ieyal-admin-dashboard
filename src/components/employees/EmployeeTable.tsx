import { useState, useMemo, useEffect } from 'react';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  MoreVertical,
  Trash2,
  Eye,
  Edit3,
  ChevronLeft,
  ChevronRight,
  UserMinus,
  Download,
} from 'lucide-react';
import clsx from 'clsx';
import type { Employee, SortField, SortDirection } from '../../types/employee';
import { Avatar } from '../ui/Avatar';
import { Badge, statusBadgeVariant, accessBadgeVariant, formatLabel } from '../ui/Badge';
import { Button } from '../ui/Button';
import { SearchBar, highlightMatch, EmptySearchState } from './SearchBar';
import { useDebounce } from '../../hooks/useDebounce';
import { useToast } from '../../hooks/useToast';

interface EmployeeTableProps {
  employees: Employee[];
  onView: (employee: Employee) => void;
  onDelete?: (ids: string[]) => void;
  onDeleteRequest?: (ids: string[]) => void;
  onEdit?: (employee: Employee) => void;
  loading?: boolean;
  externalSearch?: string;
  onExport?: (ids?: string[]) => void;
  onImportTrigger?: () => void;
}

const PAGE_SIZE = 8;

export function EmployeeTable({ employees, onView, onDeleteRequest, onEdit, loading, externalSearch }: EmployeeTableProps) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDirection>('asc');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  // sync external/global search into local search field
  useEffect(() => {
    if (typeof externalSearch === 'string') {
      setSearch(externalSearch);
      setPage(1);
    }
  }, [externalSearch]);
  const debouncedSearch = useDebounce(search, 300);
  const { addToast } = useToast();

  const filtered = useMemo(() => {
    let result = [...employees];
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (e) =>
          `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q) ||
          e.designation.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name':
          cmp = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
          break;
        case 'designation':
          cmp = a.designation.localeCompare(b.designation);
          break;
        case 'department':
          cmp = a.department.localeCompare(b.department);
          break;
        case 'status':
          cmp = a.status.localeCompare(b.status);
          break;
        case 'accessLevel':
          cmp = a.accessLevel.localeCompare(b.accessLevel);
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [employees, debouncedSearch, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === paginated.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paginated.map((e) => e.id)));
    }
  };

  const handleBulkDelete = () => {
    if (onDeleteRequest) onDeleteRequest(Array.from(selected));
    setSelected(new Set());
    // actual removal handled by parent after confirmation
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronsUpDown className="w-3.5 h-3.5 text-text-muted" />;
    return sortDir === 'asc' ? (
      <ChevronUp className="w-3.5 h-3.5 text-primary" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 text-primary" />
    );
  };

  const columns: { key: SortField | 'actions'; label: string; sortable?: boolean }[] = [
    { key: 'name', label: 'Employee', sortable: true },
    { key: 'designation', label: 'Designation', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'accessLevel', label: 'Access', sortable: true },
    { key: 'actions', label: '', sortable: false },
  ];

  return (
    <div className="bg-surface rounded-xl border border-border-light shadow-card overflow-hidden animate-fade-in">
      <div className="p-4 sm:p-5 border-b border-border-light space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display font-semibold text-text">All Employees</h2>
            <p className="text-sm text-text-secondary mt-0.5">
              {filtered.length} employee{filtered.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <div className="w-full sm:w-80">
            <SearchBar
              employees={employees}
              value={search}
              onChange={(v) => {
                setSearch(v);
                setPage(1);
              }}
              onSelect={onView}
            />
          </div>
          <div className="flex items-center gap-2 ml-2">
            <Button variant="ghost" size="sm" onClick={() => onImportTrigger && onImportTrigger()}>
              Import
            </Button>
          </div>
        </div>

        {selected.size > 0 && (
          <div className="flex items-center gap-3 px-4 py-2.5 bg-primary-light/50 rounded-lg animate-fade-in">
            <span className="text-sm font-medium text-primary">{selected.size} selected</span>
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => (onExport ? onExport(Array.from(selected)) : addToast('Export started', 'info'))}
              >
                <Download className="w-3.5 h-3.5" />
                Export
              </Button>
              <Button variant="ghost" size="sm" onClick={() => addToast('Status updated', 'success')}>
                <UserMinus className="w-3.5 h-3.5" />
                Deactivate
              </Button>
              <Button variant="danger" size="sm" onClick={handleBulkDelete}>
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </Button>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-8 text-center text-text-muted text-sm">Loading employees...</div>
      ) : filtered.length === 0 ? (
        <EmptySearchState query={debouncedSearch} />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-light bg-background/50">
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.size === paginated.length && paginated.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
                    />
                  </th>
                  {columns.map((col) => (
                    <th key={col.key} className="px-4 py-3 text-left">
                      {col.sortable ? (
                        <button
                          onClick={() => toggleSort(col.key as SortField)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-muted hover:text-text transition-colors cursor-pointer"
                        >
                          {col.label}
                          <SortIcon field={col.key as SortField} />
                        </button>
                      ) : (
                        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                          {col.label}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((emp) => {
                  const fullName = `${emp.firstName} ${emp.lastName}`;
                  const isSelected = selected.has(emp.id);
                  return (
                    <tr
                      key={emp.id}
                      className={clsx(
                        'border-b border-border-light last:border-0 transition-colors duration-150 cursor-pointer group',
                        isSelected ? 'bg-primary-light/30' : 'hover:bg-background/80'
                      )}
                      onClick={() => onView(emp)}
                    >
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(emp.id)}
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={fullName} size="sm" />
                          <div>
                            <p className="text-sm font-medium text-text">
                              {highlightMatch(fullName, debouncedSearch)}
                            </p>
                            <p className="text-xs text-text-muted">
                              {highlightMatch(emp.email, debouncedSearch)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-text-secondary">
                          {highlightMatch(emp.designation, debouncedSearch)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-text-secondary">
                          {highlightMatch(emp.department, debouncedSearch)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusBadgeVariant(emp.status)} dot>
                          {formatLabel(emp.status)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={accessBadgeVariant(emp.accessLevel)}>
                          {formatLabel(emp.accessLevel)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onEdit) onEdit(emp);
                            }}
                            className="p-1.5 mr-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-border-light text-text-muted hover:text-text transition-all cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              setOpenMenu((prev) => (prev === emp.id ? null : emp.id));
                            }}
                            className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-border-light text-text-muted hover:text-text transition-all cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {openMenu === emp.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onMouseDown={() => setOpenMenu(null)}
                              />
                              <div
                                className="absolute right-0 top-full mt-1 w-44 bg-surface border border-border-light rounded-lg shadow-lg z-20 py-1 animate-fade-in"
                                onClick={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                              >
                                <MenuItem
                                  icon={Eye}
                                  label="View Profile"
                                  onClick={() => {
                                    onView(emp);
                                    setOpenMenu(null);
                                  }}
                                />
                                <MenuItem
                                  icon={Edit3}
                                  label="Edit"
                                  onClick={() => {
                                    if (onEdit) onEdit(emp);
                                    setOpenMenu(null);
                                  }}
                                />
                                <MenuItem
                                  icon={Trash2}
                                  label="Remove"
                                  danger
                                  onClick={() => {
                                    if (onDeleteRequest) onDeleteRequest([emp.id]);
                                    setOpenMenu(null);
                                    // parent will handle confirmation and toast
                                  }}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-5 py-4 border-t border-border-light bg-background/30">
            <p className="text-sm text-text-secondary">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of{' '}
              {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg hover:bg-border-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | 'ellipsis')[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('ellipsis');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === 'ellipsis' ? (
                    <span key={`e-${i}`} className="px-2 text-text-muted">
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={clsx(
                        'w-8 h-8 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                        page === p
                          ? 'bg-primary text-white'
                          : 'hover:bg-border-light text-text-secondary'
                      )}
                    >
                      {p}
                    </button>
                  )
                )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg hover:bg-border-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: typeof Eye;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={clsx(
        'w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors cursor-pointer',
        danger ? 'text-danger hover:bg-danger-light/50' : 'text-text-secondary hover:bg-border-light hover:text-text'
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
