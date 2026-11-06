
"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-green-light">
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* Responsive sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 h-screen transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:z-30 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          collapsed={mobileOpen ? false : collapsed}
          onCollapsedChange={setCollapsed}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
      </div>

      {/* Main area */}
      <div className="relative isolate min-h-screen min-w-0 flex-1 overflow-x-clip">
        {/* Abstract background decorations */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -right-24 -top-28 h-[420px] w-[420px] rounded-full bg-action/[0.08]" />

          <div className="absolute left-[30%] top-[30%] h-[300px] w-[300px] rounded-full bg-primary/[0.025] blur-[1px]" />

          <div className="absolute -bottom-32 -right-24 h-[360px] w-[360px] rounded-full bg-action/[0.07]" />

          <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-primary/[0.025]" />

          <div className="absolute -bottom-28 left-[35%] h-64 w-[90%] rotate-[-8deg] bg-white/[0.08]" />
        </div>

        {/* Dashboard content */}
        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] flex-col p-3 sm:p-4 lg:p-5">
          <Header onMenuClick={() => setMobileOpen(true)} />

          <main className="min-w-0 flex-1 py-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
