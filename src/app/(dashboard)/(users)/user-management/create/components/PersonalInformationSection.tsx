
"use client";

import { Controller, useFormContext } from "react-hook-form";
import {
  UserRound,
  Mail,
  AtSign,
} from "lucide-react";

import TextField from "@/components/ui/TextField";
import FormSection from "@/components/dashboard/FormSection";

import type { CreateUserFormValues } from "../create-user.schema";

export default function PersonalInformationSection() {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateUserFormValues>();

  return (
    <FormSection
      step="01"
      title="Personal Information"
      description="Enter the basic identity and contact details of the user."
      icon={<UserRound size={21} />}
    >
      <Controller
        name="full_name"
        control={control}
        render={({ field }) => (
          <TextField
            label="Full Name"
            placeholder="e.g. Muhammad Hussain"
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
            placeholder="e.g. muhammad.hussain"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            name={field.name}
            leftIcon={<AtSign size={17} />}
            helperText={
              errors.username?.message ??
              "Optional. Must be between 3 and 50 characters."
            }
            minLength={3}
            maxLength={50}
            inputSize="lg"
          />
        )}
      />
    </FormSection>
  );
}
