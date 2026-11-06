
"use client";

import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";

import ViewUserHeader from "./ViewUserHeader";
import UserSummaryCard from "./UserSummaryCard";
import UserInfoBanner from "./UserInfoBanner";
import PersonalInformationSection from "./PersonalInformationSection";
import ViewRoleAssignmentSection from "./ViewRoleAssignmentSection";
import ViewAccountStatusSection from "./ViewAccountStatusSection";
import AccountInformationSection from "./AccountInformationSection";

import type { MockUserDetails } from "../data/mockUserDetails";
import { USER_VIEW_ROUTES } from "../view-user.constants";

interface ViewUserDetailsProps {
  user: MockUserDetails | null;
}

export default function ViewUserDetails({
  user,
}: ViewUserDetailsProps) {
  const router = useRouter();

  const handleBack = () => {
    router.push(USER_VIEW_ROUTES.list);
  };

  const handleEdit = () => {
    if (!user) return;

    router.push(USER_VIEW_ROUTES.edit(user.id));
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

  const assignedRolesCount = user.role_ids.length;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-10">
      <ViewUserHeader
        onBack={handleBack}
        onEdit={handleEdit}
      />

      <UserSummaryCard
        user={user}
        assignedRolesCount={assignedRolesCount}
      />

      <UserInfoBanner />

      <PersonalInformationSection user={user} />

      <ViewRoleAssignmentSection user={user} />

      <ViewAccountStatusSection isActive={user.is_active} />

      <AccountInformationSection user={user} />

      <div className="flex flex-col-reverse gap-3 rounded-xl border border-border-default bg-white p-4 sm:flex-row sm:justify-end sm:px-5">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={handleBack}
        >
          Back to Users
        </Button>

        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={handleEdit}
        >
          Edit User
        </Button>
      </div>
    </div>
  );
}
