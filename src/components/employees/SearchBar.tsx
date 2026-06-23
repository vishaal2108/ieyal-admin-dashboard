import { useState, useRef, useEffect } from 'react';
import { Search, X, User } from 'lucide-react';
import type { Employee } from '../../types/employee';
import { Avatar } from '../ui/Avatar';
import { useDebounce } from '../../hooks/useDebounce';

interface SearchBarProps {
  employees: Employee[];
  value: string;
  onChange: (value: string) => void;
  onSelect: (employee: Employee) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="search-highlight">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function SearchBar({
  employees,
  value,
  onChange,
  onSelect,
  placeholder = 'Search by name, email, department...',
  autoFocus,
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const debouncedQuery = useDebounce(value, 200);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions =
    debouncedQuery.trim().length >= 1
      ? employees
          .filter((emp) => {
            const q = debouncedQuery.toLowerCase();
            const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
            return (
              fullName.includes(q) ||
              emp.email.toLowerCase().includes(q) ||
              emp.department.toLowerCase().includes(q) ||
              emp.designation.toLowerCase().includes(q)
            );
          })
          .slice(0, 6)
      : [];

  const showDropdown = focused && value.trim().length >= 1;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          autoFocus={autoFocus}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-muted"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border-light rounded-xl shadow-lg z-50 overflow-hidden animate-fade-in">
          {suggestions.length > 0 ? (
            <>
              <div className="px-3 py-2 border-b border-border-light">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Suggestions
                </p>
              </div>
              <ul>
                {suggestions.map((emp) => (
                  <li key={emp.id}>
                    <button
                      onClick={() => {
                        onSelect(emp);
                        onChange('');
                        setFocused(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-border-light transition-colors text-left cursor-pointer"
                    >
                      <Avatar name={`${emp.firstName} ${emp.lastName}`} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text truncate">
                          {highlightMatch(`${emp.firstName} ${emp.lastName}`, debouncedQuery)}
                        </p>
                        <p className="text-xs text-text-muted truncate">
                          {highlightMatch(emp.designation, debouncedQuery)} ·{' '}
                          {highlightMatch(emp.department, debouncedQuery)}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="px-4 py-8 text-center">
              <User className="w-8 h-8 text-text-muted mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium text-text-secondary">No employees found</p>
              <p className="text-xs text-text-muted mt-1">
                Try searching by name, email, or department
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function EmptySearchState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-2xl bg-border-light flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-text-muted" />
      </div>
      <h3 className="font-display font-semibold text-text mb-1">No results for "{query}"</h3>
      <p className="text-sm text-text-secondary text-center max-w-sm">
        We couldn't find any employees matching your search. Try adjusting your filters or search
        terms.
      </p>
    </div>
  );
}
