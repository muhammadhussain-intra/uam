
"use client";

import { Controller, useFormContext } from "react-hook-form";
import {
  UserRound,
  Mail,
  AtSign,
  Building2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import TextField from "@/components/ui/TextField";
import CheckboxField from "@/components/ui/CheckboxField";
import FormSection from "@/components/dashboard/FormSection";

import { ROLE_OPTIONS } from "../../../create/create-user.constants";
import type { EditUserFormValues } from "../edit-user.schema";

export default function EditUserFields() {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<EditUserFormValues>();

  const selectedRoles = watch("role_ids");
  const isActive = watch("is_active");

  return (
    <>
      {/* Personal Information */}
      <FormSection
        step="01"
        title="Personal Information"
        description="Update the user's identity and contact details."
        icon={<UserRound size={21} />}
      >
        <Controller
          name="full_name"
          control={control}
          render={({ field }) => (
            <TextField
              label="Full Name"
              placeholder="Enter full name"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              leftIcon={<UserRound size={17} />}
              required
              maxLength={100}
              inputSize="lg"
              helperText={errors.full_name?.message}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              leftIcon={<Mail size={17} />}
              required
              maxLength={254}
              inputSize="lg"
              helperText={errors.email?.message}
            />
          )}
        />

        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <TextField
              label="Username"
              placeholder="Enter username"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              leftIcon={<AtSign size={17} />}
              helperText={
                errors.username?.message ??
                "Must be between 3 and 50 characters."
              }
              minLength={3}
              maxLength={50}
              inputSize="lg"
            />
          )}
        />
      </FormSection>

      {/* Access & Assignment */}
      <FormSection
        step="02"
        title="Access & Assignment"
        description="Manage the user's assigned roles and program association."
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
                          field.onChange(
                            checked
                              ? [...field.value, role.value]
                              : field.value.filter(
                                  (id) => id !== role.value,
                                ),
                          );
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

      {/* Account Status */}
      <FormSection
        step="03"
        title="Account Status"
        description="Manage the current status of this user account."
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
                    label={isActive ? "Active" : "Inactive"}
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </FormSection>
    </>
  );
}
