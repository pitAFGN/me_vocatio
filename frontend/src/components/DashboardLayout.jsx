"use client";

import SidebarNav from "@/components/SidebarNav";

export default function DashboardLayout({
  logout,
  mainClassName = "flex-1 md:pl-64 p-6 md:p-10 pb-24 md:pb-10",
  fondoClassName = "bg-slate-50 dark:bg-[#040613]",
  decoracion = null,
  children,
}) {
  return (
    <div
      className={`min-h-screen ${fondoClassName} text-slate-900 dark:text-slate-100 flex relative overflow-x-hidden transition-colors duration-300`}
    >
      {decoracion}
      <SidebarNav logout={logout} />
      <main className={mainClassName}>{children}</main>
    </div>
  );
}