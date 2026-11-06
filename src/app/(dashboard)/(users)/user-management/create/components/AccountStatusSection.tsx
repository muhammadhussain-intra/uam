
"use client";

import { Controller, useFormContext } from "react-hook-form";
import {
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

import CheckboxField from "@/components/ui/CheckboxField";
import FormSection from "@/components/dashboard/FormSection";

import type { CreateUserFormValues } from "../create-user.schema";

export default function AccountStatusSection() {
  const { control } = useFormContext<CreateUserFormValues>();

  return (
    <FormSection
      step="03"
      title="Account Status"
      description="Configure the initial status of this user account."
      icon={<CheckCircle2 size={21} />}
    >
      <div className="sm:col-span-2">
        <div className="flex flex-col justify-between gap-4 rounded-xl border border-border-default bg-subtle/40 p-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-green-light text-primary">
              <ShieldCheck size={19} />
            </div>

            <div>
              <p className="text-sm font-semibold text-text-primary">
                Active Account
              </p>

              <p className="mt-1 max-w-lg text-xs leading-relaxed text-text-secondary">
                An active user can sign in and access the system
                according to their assigned roles.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <CheckboxField
                  label={field.value ? "Active" : "Inactive"}
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>
      </div>
    </FormSection>
  );
}
