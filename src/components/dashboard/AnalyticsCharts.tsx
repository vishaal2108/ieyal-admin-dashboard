import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { Employee } from '../../types/employee';

const COLORS = ['#2563EB', '#7C3AED', '#22C55E', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899', '#8B5CF6'];

interface AnalyticsChartsProps {
  employees: Employee[];
}

function aggregateByField(employees: Employee[], field: keyof Employee): { name: string; value: number }[] {
  const map = new Map<string, number>();
  employees.forEach((emp) => {
    const key = String(emp[field]);
    map.set(key, (map.get(key) ?? 0) + 1);
  });
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string; payload: { name: string; value: number } }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded-lg shadow-lg px-3 py-2 text-sm">
      <p className="font-medium text-text">{label ?? payload[0].payload.name}</p>
      <p className="text-text-secondary">
        {payload[0].value} employee{payload[0].value !== 1 ? 's' : ''}
      </p>
    </div>
  );
};

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface rounded-xl border border-border-light p-5 shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in">
      <div className="mb-4">
        <h3 className="font-display font-semibold text-text">{title}</h3>
        {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export function AnalyticsCharts({ employees }: AnalyticsChartsProps) {
  const statusData = aggregateByField(employees, 'status').map((d) => ({
    ...d,
    name: d.name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
  }));

  const departmentData = aggregateByField(employees, 'department');
  const designationData = aggregateByField(employees, 'designation').slice(0, 8);
  const accessData = aggregateByField(employees, 'accessLevel').map((d) => ({
    ...d,
    name: d.name.charAt(0).toUpperCase() + d.name.slice(1),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard title="Active vs Inactive" subtitle="Employee status breakdown">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {statusData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              formatter={(value: string) => (
                <span className="text-xs text-text-secondary">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Employees by Department" subtitle="Headcount across teams">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={departmentData} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#2563EB" radius={[0, 6, 6, 0]} animationDuration={800} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Employees by Designation" subtitle="Top roles in organization">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={designationData} margin={{ bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              angle={-35}
              textAnchor="end"
              interval={0}
              height={70}
            />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#7C3AED" radius={[6, 6, 0, 0]} animationDuration={800} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Access Level Distribution" subtitle="Permission tiers across org">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={accessData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              animationBegin={200}
              animationDuration={800}
              label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              labelLine={{ stroke: '#e2e8f0' }}
            >
              {accessData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
