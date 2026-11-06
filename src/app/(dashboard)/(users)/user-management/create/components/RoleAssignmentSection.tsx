
"use client";

import { Controller, useFormContext } from "react-hook-form";
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import TextField from "@/components/ui/TextField";
import CheckboxField from "@/components/ui/CheckboxField";
import FormSection from "@/components/dashboard/FormSection";

import { ROLE_OPTIONS } from "../create-user.constants";
import type { CreateUserFormValues } from "../create-user.schema";

export default function RoleAssignmentSection() {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<CreateUserFormValues>();

  const selectedRoles = watch("role_ids");

  return (
    <FormSection
      step="02"
      title="Access & Assignment"
      description="Define the user's role and program association."
      icon={<ShieldCheck size={21} />}
    >
      <div className="sm:col-span-2">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <label className="text-sm font-semibold text-text-primary">
              Assign Roles <span className="text-error">*</span>
            </label>

            <p className="mt-1 text-xs text-text-secondary">
              Select one or more roles for this user.
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-green-light/40 px-3 py-1.5 text-xs font-semibold text-primary">
            <CheckCircle2 size={14} />
            {selectedRoles.length} Selected
          </span>
        </div>

        <Controller
          name="role_ids"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ROLE_OPTIONS.map((role) => {
                const selected = field.value.includes(role.value);

                return (
                  <div
                    key={role.value}
                    className={[
                      "rounded-xl border p-3 transition-all",
                      selected
                        ? "border-primary bg-green-light/30 shadow-sm"
                        : "border-border-default bg-white hover:border-border-strong",
                    ].join(" ")}
                  >
                    <CheckboxField
                      label={role.label}
                      description={role.description}
                      checked={selected}
                      onChange={(checked) => {
                        const updatedRoles = checked
                          ? [...field.value, role.value]
                          : field.value.filter(
                              (id) => id !== role.value,
                            );

                        field.onChange(updatedRoles);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        />

        {errors.role_ids?.message && (
          <p className="mt-3 text-xs text-error">
            {errors.role_ids.message}
          </p>
        )}
      </div>

      <div className="sm:col-span-1">
        <Controller
          name="program_id"
          control={control}
          render={({ field }) => (
            <TextField
              label="Program ID"
              type="number"
              min={1}
              placeholder="Enter program ID"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              leftIcon={<Building2 size={17} />}
              helperText={
                errors.program_id?.message ??
                "Optional. Enter the associated program ID."
              }
              inputSize="lg"
            />
          )}
        />
      </div>
    </FormSection>
  );
}
