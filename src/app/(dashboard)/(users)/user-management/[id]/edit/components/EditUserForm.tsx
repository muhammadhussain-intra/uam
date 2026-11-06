
"use client";

import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import Button from "@/components/ui/Button";

import EditUserHeader from "./EditUserHeader";
import EditUserFields from "./EditUserFields";
import EditUserFooter from "./EditUserFooter";

import { EDIT_USER_INITIAL_FORM } from "../edit-user.constants";

import {
  editUserSchema,
  type EditUserFormValues,
} from "../edit-user.schema";

import type { MockEditUser } from "../data/mockEditUsers";

interface EditUserFormProps {
  user: MockEditUser | null;
}

export default function EditUserForm({
  user,
}: EditUserFormProps) {
  const router = useRouter();

  const methods = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: user
      ? {
          full_name: user.full_name,
          email: user.email,
          username: user.username,
          role_ids: user.role_ids,
          program_id: user.program_id,
          is_active: user.is_active,
        }
      : EDIT_USER_INITIAL_FORM,
    mode: "onSubmit",
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleBack = () => {
    router.push("/user-management/users-list");
  };

  const onSubmit = async (values: EditUserFormValues) => {
    try {
      console.log("Updated user values:", {
        id: user?.id,
        ...values,
      });

      toast.info(
        "Form validation successful. API integration is pending.",
      );
    } catch {
      toast.error("Unable to update user. Please try again.");
    }
  };

  if (!user) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-4 py-20">
        <h2 className="text-xl font-semibold text-text-primary">
          User Not Found
        </h2>

        <p className="text-sm text-text-secondary">
          The requested user does not exist.
        </p>

        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
        >
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-10">
      <EditUserHeader onBack={handleBack} />

      <div className="flex items-start gap-3 rounded-xl border border-primary/15 bg-green-light/40 p-4">
        <div>
          <p className="text-sm font-semibold text-text-primary">
            Editing user information
          </p>

          <p className="mt-1 text-xs leading-relaxed text-text-secondary">
            Changes will update this user&apos;s profile and access
            configuration once you save them.
          </p>
        </div>
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <EditUserFields />

          <EditUserFooter
            isSubmitting={isSubmitting}
            onCancel={handleBack}
          />
        </form>
      </FormProvider>
    </div>
  );
}
