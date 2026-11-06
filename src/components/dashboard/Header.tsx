"use client";

import { useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import {
  Search,
  ChevronDown,
  Menu,
  UserRound,
  LogOut,
  Loader2,
  BriefcaseBusiness,
} from "lucide-react";

import type { RootState } from "@/lib/store";
import { useLogout } from "@/hooks/useLogout";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [search, setSearch] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Get user from Redux
  const user = useSelector((state: RootState) => state.auth.user);

  const roles = user?.roles ?? [];
  const hasMultipleRoles = roles.length > 1;

  // Existing logout hook
  const { logout, isLoggingOut } = useLogout();

  // Dynamic user information
  const userName = user?.full_name ?? "User";
  const userRole = user?.roles?.[0]?.name ?? "User";

  async function handleLogout() {
    setIsProfileOpen(false);
    await logout();
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 min-w-0 shrink-0 items-center gap-2 rounded-xl border border-white/70 bg-white/85 px-2.5 shadow-sm backdrop-blur-xl sm:gap-4 sm:rounded-2xl sm:px-4 lg:px-6">
      {/* Mobile Menu */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-primary transition-colors hover:bg-subtle lg:hidden"
      >
        <Menu size={21} />
      </button>

      {/* Search */}
      <form
        role="search"
        onSubmit={(event) => event.preventDefault()}
        className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border border-border-default bg-white px-2.5 focus-within:border-primary sm:max-w-170 sm:gap-3 sm:px-3"
      >
        <Search size={17} className="shrink-0 text-text-secondary" />

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search..."
          aria-label="Search dashboard"
          className="min-w-0 flex-1 bg-transparent text-xs text-text-primary outline-none placeholder:text-text-secondary sm:text-sm"
        />
      </form>

      {/* Profile Dropdown */}
      <div className="relative ml-auto shrink-0">
        <button
          type="button"
          onClick={() => setIsProfileOpen((prev) => !prev)}
          aria-expanded={isProfileOpen}
          aria-haspopup="menu"
          aria-label="Open user menu"
          className="flex min-w-0 items-center gap-1.5 rounded-lg p-1 hover:bg-subtle sm:gap-2 sm:p-1.5"
        >
          {/* Avatar */}
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-light text-sm font-semibold text-primary sm:h-10 sm:w-10 sm:text-base">
            {userName.charAt(0).toUpperCase()}
          </span>

          {/* User Details */}
          <span className="hidden min-w-0 text-left md:block">
            <span className="block max-w-40 truncate text-xs font-semibold text-text-primary">
              {userName}
            </span>

            <span className="mt-0.5 block text-xs text-text-secondary">
              {userRole}
            </span>
          </span>

          <ChevronDown
            size={15}
            className={`hidden text-text-secondary transition-transform md:block ${
              isProfileOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown */}
        {isProfileOpen && (
          <div
            role="menu"
            className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border-default bg-white p-1.5 shadow-lg"
          >
            {/* User Info */}
            <div className="border-b border-border-default px-3 py-2.5">
              <p className="truncate text-sm font-semibold text-text-primary">
                {userName}
              </p>

              <p className="truncate text-xs text-text-secondary">
                {user?.email}
              </p>
            </div>

            {/* Profile */}
            <Link
              href="/profile"
              role="menuitem"
              onClick={() => setIsProfileOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-primary transition-colors hover:bg-subtle"
            >
              <UserRound size={17} />
              My Profile
            </Link>

            {/* Workspace Selection */}
            {hasMultipleRoles && (
              <Link
                href="/workspace-selection"
                role="menuitem"
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-primary transition-colors hover:bg-subtle"
              >
                <BriefcaseBusiness size={17} />
                Switch Workspace
              </Link>
            )}

            {/* Logout */}
            <button
              type="button"
              role="menuitem"
              disabled={isLoggingOut}
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-error transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoggingOut ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <LogOut size={17} />
              )}

              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
