export type EmployeeStatus = 'active' | 'inactive' | 'on-leave';
export type AccessLevel = 'admin' | 'manager' | 'employee' | 'viewer';

export interface ActivityEntry {
  id: string;
  action: string;
  timestamp: string;
  details?: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  status: EmployeeStatus;
  accessLevel: AccessLevel;
  joinDate: string;
  avatar?: string;
  location: string;
  manager?: string;
  activity: ActivityEntry[];
}

export type SortField = 'name' | 'designation' | 'department' | 'status' | 'accessLevel';
export type SortDirection = 'asc' | 'desc';

export interface EmployeeFilters {
  search: string;
  department: string;
  status: string;
  accessLevel: string;
}
