"use client";

import { ShieldCheck } from "lucide-react";

import MfaSettingsCard from "./MfaSettingsCard";

export default function SecuritySettingsOverview() {
  return (
    <div className="space-y-4">
      {/* Page heading */}
      <section className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
          <ShieldCheck size={21} />
        </div>

        <div className="min-w-0">
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-text-primary sm:text-3xl">
            Security Settings
          </h1>

          <p className="mt-1 text-xs text-text-secondary">
            Manage authentication, single sign-on and security policies for your
            organization.
          </p>
        </div>
      </section>

      {/* MFA */}
      <MfaSettingsCard />
    </div>
  );
}
