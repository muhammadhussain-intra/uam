"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CheckCircle2,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  X,
} from "lucide-react";
import { dashboardNavigation as navigation } from "@/constants/dashboard-navigation";
import { useLogout } from "@/hooks/useLogout";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { BriefcaseBusiness } from "lucide-react";

interface SidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({
  collapsed: controlledCollapsed,
  onCollapsedChange,
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.auth.user);

  const hasMultipleRoles = (user?.roles?.length ?? 0) > 1;
  const { logout, isLoggingOut } = useLogout();

  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([
    "User Management",
  ]);

  const collapsed = controlledCollapsed ?? internalCollapsed;
  const compact = collapsed && !mobileOpen;

  function toggleCollapsed() {
    const next = !collapsed;
    setInternalCollapsed(next);
    onCollapsedChange?.(next);
  }

  function toggleMenu(label: string) {
    setExpandedMenus((previous) =>
      previous.includes(label)
        ? previous.filter((item) => item !== label)
        : [...previous, label],
    );
  }

  function handleNavigation() {
    onMobileClose?.();
  }

  async function handleLogout() {
    onMobileClose?.();
    await logout();
  }

  return (
    <aside
      className={`flex h-full flex-col border-r border-white/10 bg-[#004C37] text-white shadow-xl transition-[width] duration-200 ${
        compact ? "w-18" : "w-62"
      }`}
    >
      {/* Brand */}
      <div
        className={`flex h-20 shrink-0 items-center gap-3 px-5 ${
          compact ? "justify-center px-2" : ""
        }`}
      >
        <Link
          href="/dashboard"
          title="UAM Dashboard"
          onClick={handleNavigation}
          className="flex min-w-0 items-center gap-3"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary">
            <CheckCircle2 size={25} fill="currentColor" stroke="white" />
          </span>

          {!compact && (
            <span className="min-w-0">
              <span className="block text-xl font-bold leading-tight">UAM</span>
              <span className="block text-xs text-white/70">Module</span>
            </span>
          )}
        </Link>

        {/* Close button: mobile only */}
        {mobileOpen && (
          <button
            type="button"
            onClick={onMobileClose}
            aria-label="Close navigation menu"
            className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={19} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav
        aria-label="Dashboard navigation"
        className="flex-1 space-y-1 overflow-y-auto px-3 py-3"
      >
        {navigation.map((item) => {
          const Icon = item.icon;
          const hasChildren = Boolean(item.children?.length);

          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" &&
              pathname.startsWith(`${item.href}/`));

          const menuExpanded = expandedMenus.includes(item.label);

          return (
            <div key={item.label}>
              <div
                className={`group flex min-h-11 items-center rounded-lg ${
                  active
                    ? "bg-primary text-white"
                    : "text-white/85 hover:bg-white/10"
                }`}
              >
                <Link
                  href={item.href}
                  title={compact ? item.label : undefined}
                  onClick={handleNavigation}
                  aria-current={active && !hasChildren ? "page" : undefined}
                  className={`flex min-h-11 min-w-0 flex-1 items-center gap-3 px-3 ${
                    compact ? "justify-center px-0" : ""
                  }`}
                >
                  <Icon size={18} className="shrink-0 text-white" />

                  {!compact && (
                    <span className="truncate text-[13px] font-medium text-white">
                      {item.label}
                    </span>
                  )}
                </Link>

                {hasChildren && !compact && (
                  <button
                    type="button"
                    onClick={() => toggleMenu(item.label)}
                    aria-label={`Toggle ${item.label} submenu`}
                    aria-expanded={menuExpanded}
                    className="flex h-11 w-8 shrink-0 items-center justify-center rounded-r-lg hover:bg-white/10"
                  >
                    <ChevronRight
                      size={15}
                      className={`text-white transition-transform ${
                        menuExpanded ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                )}
              </div>

              {hasChildren && menuExpanded && !compact && (
                <div className="ml-6 mt-1 space-y-1 border-l border-white/20 pl-3">
                  {item.children!.map((child) => {
                    const childActive = pathname === child.href;

                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={handleNavigation}
                        aria-current={childActive ? "page" : undefined}
                        className={`block rounded-md px-3 py-2 text-xs transition-colors ${
                          childActive
                            ? "bg-white/15 text-white"
                            : "text-white/70 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span className="truncate text-white">
                          {child.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="shrink-0 space-y-1 border-t border-white/15 p-3">
        <button
          type="button"
          onClick={toggleCollapsed}
          className={`hidden lg:flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-sm text-white/85 transition-colors hover:bg-white/10 ${
            compact ? "justify-center px-0" : ""
          }`}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {compact ? (
            <ChevronsRight size={18} />
          ) : (
            <>
              <ChevronsLeft size={18} />
              <span>Collapse</span>
            </>
          )}
        </button>

        {/* Workspace Selection */}
        {hasMultipleRoles && (
          <Link
            href="/workspace-selection"
            onClick={handleNavigation}
            title={compact ? "Switch Workspace" : undefined}
            className={`flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-sm text-white transition-colors hover:bg-white/10 hover:text-white ${
              compact ? "justify-center px-0" : ""
            }`}
          >
            <BriefcaseBusiness size={18} className="shrink-0 text-white" />

            {!compact && <span className="text-white">Switch Workspace</span>}
          </Link>
        )}

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          title={compact ? "Logout" : undefined}
          className={`flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-sm text-white transition-colors hover:bg-red-500/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 ${
            compact ? "justify-center px-0" : ""
          }`}
        >
          <LogOut size={18} className="shrink-0" />
          {!compact && (
            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
          )}
        </button>
      </div>
    </aside>
  );
}
