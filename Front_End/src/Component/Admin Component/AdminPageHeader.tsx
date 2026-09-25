import type { ReactNode } from "react";

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

const AdminPageHeader = ({ title, subtitle, children }: AdminPageHeaderProps) => (
  <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-indigo-600 p-6 text-white shadow-card">
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-indigo-100">{subtitle}</p>}
    </div>
    {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
  </div>
);

export default AdminPageHeader;