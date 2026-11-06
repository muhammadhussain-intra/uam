"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Compass, LayoutDashboard } from "lucide-react";
import Button from "@/components/ui/Button";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-page px-4 py-12 text-center sm:px-6 lg:px-8">
      {/* Modal / Card */}
      <div className="w-full max-w-md rounded-2xl border border-border-default bg-card p-8 shadow-card sm:p-10">
        {/* Brand Icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-light text-primary">
          <Compass size={32} className="stroke-[1.75]" />
        </div>

        {/* Status Pill */}
        <span className="inline-flex items-center rounded-full bg-green-light px-3 py-1 text-xs font-semibold text-primary">
          404 • Under Development
        </span>

        {/* Heading */}
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          Page is under development
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">
          The page you are trying to access is currently being developed or does not exist yet. Please check back later.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            type="button"
            variant="primary"
            leftIcon={<ArrowLeft size={16} />}
            onClick={() => router.back()}
            className="w-full sm:w-auto"
          >
            Go Back
          </Button>

          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              leftIcon={<LayoutDashboard size={16} />}
              className="w-full sm:w-auto"
            >
              Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Brand Note */}
      <p className="mt-6 text-xs text-text-muted">
        UAM • Unified Access Management
      </p>
    </main>
  );
}

