
"use client";

import { useRouter } from "next/navigation";
import {
  FormProvider,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import CreateUserHeader from "./CreateUserHeader";
import CreateUserInfoBanner from "./CreateUserInfoBanner";
import PersonalInformationSection from "./PersonalInformationSection";
import RoleAssignmentSection from "./RoleAssignmentSection";
import AccountStatusSection from "./AccountStatusSection";
import CreateUserFooter from "./CreateUserFooter";

import { INITIAL_USER_FORM } from "../create-user.constants";
import {
  createUserSchema,
  type CreateUserFormValues,
} from "../create-user.schema";

import createUser from "../actions/createUser";

export default function CreateUserForm() {
  const router = useRouter();

  const methods = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: INITIAL_USER_FORM,
    mode: "onSubmit",
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (values: CreateUserFormValues) => {
    try {
      const response = await createUser(values);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);

      router.push("/user-management/users-list");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-10">
      <CreateUserHeader onBack={handleCancel} />

      <CreateUserInfoBanner />

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <PersonalInformationSection />

          <RoleAssignmentSection />

          <AccountStatusSection />

          <CreateUserFooter
            isSubmitting={isSubmitting}
            onCancel={handleCancel}
          />
        </form>
      </FormProvider>
    </div>
  );
}
