import type { Employee } from '../types/employee';

const departments = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
];

const designations: Record<string, string[]> = {
  Engineering: ['Software Engineer', 'Senior Engineer', 'Tech Lead', 'DevOps Engineer', 'QA Engineer'],
  Product: ['Product Manager', 'Product Analyst', 'Product Owner'],
  Design: ['UI Designer', 'UX Designer', 'Design Lead'],
  Marketing: ['Marketing Manager', 'Content Strategist', 'SEO Specialist'],
  Sales: ['Sales Executive', 'Account Manager', 'Sales Director'],
  'Human Resources': ['HR Manager', 'Recruiter', 'HR Business Partner'],
  Finance: ['Financial Analyst', 'Accountant', 'Finance Manager'],
  Operations: ['Operations Manager', 'Project Coordinator', 'Business Analyst'],
};

const accessLevels = ['admin', 'manager', 'employee', 'viewer'] as const;
const statuses = ['active', 'active', 'active', 'active', 'inactive', 'on-leave'] as const;

const firstNames = [
  'Aarav', 'Priya', 'Rahul', 'Ananya', 'Vikram', 'Meera', 'Arjun', 'Kavya',
  'Rohan', 'Sneha', 'Aditya', 'Divya', 'Karan', 'Isha', 'Nikhil', 'Pooja',
  'Sanjay', 'Neha', 'Varun', 'Shreya', 'Amit', 'Tanvi', 'Deepak', 'Ritu',
  'Manish', 'Swati', 'Gaurav', 'Anjali', 'Harsh', 'Nidhi', 'Suresh', 'Lakshmi',
  'Rajesh', 'Geeta', 'Vivek', 'Preeti', 'Ashok', 'Sunita', 'Ramesh', 'Kavita',
];

const lastNames = [
  'Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Reddy', 'Nair', 'Iyer',
  'Joshi', 'Mehta', 'Desai', 'Rao', 'Verma', 'Malhotra', 'Chopra', 'Kapoor',
  'Agarwal', 'Bansal', 'Khanna', 'Saxena', 'Tiwari', 'Mishra', 'Pandey', 'Dubey',
];

function randomItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateActivity(_name: string): Employee['activity'] {
  const actions = [
    { action: 'Logged in', details: 'From Chrome on Windows' },
    { action: 'Updated profile', details: 'Changed phone number' },
    { action: 'Access granted', details: 'Manager portal access' },
    { action: 'Document uploaded', details: 'Employment contract' },
    { action: 'Leave request submitted', details: '3 days annual leave' },
    { action: 'Password changed', details: undefined },
    { action: 'Team meeting attended', details: 'Weekly standup' },
  ];

  const count = 3 + Math.floor(Math.random() * 4);
  const selected = [...actions].sort(() => Math.random() - 0.5).slice(0, count);

  return selected.map((a, i) => ({
    id: `act-${i}`,
    action: a.action,
    details: a.details,
    timestamp: new Date(Date.now() - (i + 1) * 86400000 * (1 + Math.random() * 5)).toISOString(),
  }));
}

function generateEmployees(count: number): Employee[] {
  const employees: Employee[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
    const department = departments[i % departments.length];
    const deptDesignations = designations[department];
    const designation = deptDesignations[i % deptDesignations.length];
    const status = statuses[i % statuses.length];
    const accessLevel = i < 2 ? 'admin' : i < 8 ? 'manager' : randomItem(accessLevels);

    employees.push({
      id: `emp-${String(i + 1).padStart(3, '0')}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@ieyal.com`,
      phone: `+91 ${90000 + i * 137}${String(1000 + i).slice(-4)}`,
      designation,
      department,
      status,
      accessLevel,
      joinDate: new Date(2020 + (i % 5), i % 12, (i % 28) + 1).toISOString().split('T')[0],
      location: randomItem(['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai']),
      manager: i > 5 ? `${firstNames[(i + 3) % firstNames.length]} ${lastNames[(i + 2) % lastNames.length]}` : undefined,
      activity: generateActivity(`${firstName} ${lastName}`),
    });
  }

  return employees;
}

export const initialEmployees = generateEmployees(48);

export const departmentOptions = departments;
export const designationOptions = Object.values(designations).flat();
export const accessLevelOptions = ['admin', 'manager', 'employee', 'viewer'] as const;
export const statusOptions = ['active', 'inactive', 'on-leave'] as const;
