"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  ShieldCheck,
  ArrowRight,
  LoaderCircle,
  Circle,
  CircleDot,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/ui/Button";
import type { AuthState, AuthRole } from "@/types/auth.types";
import { useLogout } from "@/hooks/useLogout";
import { selectWorkspace } from "../actions/workspace-selection";

interface WorkspaceSelectionFormProps {
  programId?: number;
}

export default function WorkspaceSelectionForm({
  programId,
}: WorkspaceSelectionFormProps) {
  const router = useRouter();
  const { logout } = useLogout();

  // Get authenticated user and assigned roles from Redux
  const user = useSelector((state: { auth: AuthState }) => state.auth.user);

  const roles: AuthRole[] = user?.roles ?? [];

  const [selectedRole, setSelectedRole] = useState<number | null>(null);

  useEffect(() => {
    if (roles.length > 0) {
      setSelectedRole((current) => {
        // Keep existing selection if it still exists
        if (roles.some((role) => role.id === current)) {
          return current;
        }

        // Otherwise select first available role
        return roles[0].id;
      });
    } else {
      setSelectedRole(null);
    }
  }, [roles]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Continue with selected role
  async function handleContinue() {
    if (selectedRole === null) {
      toast.error("Please select a role.");
      return;
    }

    // if (!Number.isInteger(programId) || programId <= 0) {
    //   toast.error("Invalid program selection.");
    //   return;
    // }

    setIsSubmitting(true);

    try {
      const result = await selectWorkspace({
        program_id: programId ?? 1,
        role_id: selectedRole,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      sessionStorage.setItem("uam_selected_role", String(selectedRole));

      toast.success(result.message);

      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("[Workspace] Selection Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Sign out
  async function handleSignOut() {
    await logout();
    router.replace("/login");
  }

  return (
    <div className="w-full max-w-110 rounded-2xl border border-white/50 bg-white/65 p-6 shadow-(--shadow-modal) backdrop-blur-xl sm:p-7">
      {/* Brand */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-white">
          <ShieldCheck size={19} />
        </div>

        <div>
          <p className="text-sm font-semibold leading-tight text-text-primary">
            UAM
          </p>
          <p className="mt-0.5 text-xs leading-tight text-text-secondary">
            User & Access Management
          </p>
        </div>
      </div>

      {/* Heading */}
      <h2 className="text-3xl font-bold leading-tight tracking-tight text-text-primary">
        Select workspace
      </h2>

      <p className="mt-1.5 text-sm text-text-secondary">
        Welcome {user?.full_name || "User"}. Choose a role to continue.
      </p>

      {/* Roles List */}
      <div className="mt-5">
        {!user ? (
          <div className="rounded-xl border border-error/20 bg-error/5 p-5 text-center">
            <p className="text-sm text-error">
              User information not found. Please sign in again.
            </p>
          </div>
        ) : roles.length === 0 ? (
          <div className="rounded-xl border border-border-default p-5 text-center">
            <ShieldCheck size={28} className="mx-auto text-text-muted" />

            <p className="mt-2 text-sm font-semibold text-text-primary">
              No roles assigned
            </p>

            <p className="mt-1 text-xs text-text-secondary">
              Contact your administrator to get role access.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-text-primary">
                Available roles
              </p>

              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                {roles.length} {roles.length === 1 ? "Role" : "Roles"}
              </span>
            </div>

            {/* Scrollable Roles */}
            <div
              className="max-h-64 space-y-2 overflow-y-auto overscroll-contain pr-2"
              style={{ scrollbarGutter: "stable" }}
            >
              {roles.map((role) => {
                const isSelected = selectedRole === role.id;

                return (
                  <button
                    key={role.id}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setSelectedRole(role.id)}
                    aria-pressed={isSelected}
                    className={[
                      "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200",
                      isSelected
                        ? "border-primary bg-white shadow-sm ring-1 ring-primary"
                        : "border-border-default bg-white/70 hover:border-primary/50 hover:bg-white",
                      "disabled:cursor-not-allowed disabled:opacity-60",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "flex size-10 shrink-0 items-center justify-center rounded-full",
                        isSelected
                          ? "bg-primary text-white"
                          : "bg-subtle text-primary",
                      ].join(" ")}
                    >
                      <ShieldCheck size={19} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-text-primary">
                        {role.name}
                      </p>

                      <p className="mt-1 text-xs text-text-secondary">
                        Role Code: {role.code || "N/A"}
                      </p>
                    </div>

                    <div className="shrink-0">
                      {isSelected ? (
                        <CircleDot size={20} className="text-primary" />
                      ) : (
                        <Circle size={20} className="text-border-strong" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Permission Notice */}
      <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-border-default bg-subtle/80 px-3 py-3">
        <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />

        <p className="text-[11px] font-medium leading-relaxed text-text-secondary">
          Your access and permissions will be determined by your selected role.
        </p>
      </div>

      {/* Continue */}
      <Button
        type="button"
        variant="primary"
        size="lg"
        fullWidth
        className="mt-4"
        loading={isSubmitting}
        disabled={!user || roles.length === 0 || !selectedRole || isSubmitting}
        rightIcon={!isSubmitting && <ArrowRight size={17} />}
        onClick={handleContinue}
      >
        Continue
      </Button>

      {/* Sign Out */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        fullWidth
        className="mt-1 text-primary hover:bg-green-light/40"
        disabled={isSubmitting}
        onClick={handleSignOut}
      >
        Sign out
      </Button>
    </div>
  );
}
