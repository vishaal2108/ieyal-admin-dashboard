import clsx from 'clsx';
import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  sidebar: ReactNode;
  topNav: ReactNode;
  children: ReactNode;
  sidebarCollapsed: boolean;
}

export function DashboardLayout({
  sidebar,
  topNav,
  children,
  sidebarCollapsed,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {sidebar}
      <div
        className={clsx(
          'transition-all duration-300 min-h-screen flex flex-col',
          sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-64'
        )}
      >
        {topNav}
        <main className="flex-1 p-6 lg:p-8 max-w-[1600px]">{children}</main>
      </div>
    </div>
  );
}
