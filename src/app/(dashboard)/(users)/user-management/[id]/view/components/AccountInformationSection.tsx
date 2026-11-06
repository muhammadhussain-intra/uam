
import {
  Clock3,
  CalendarDays,
  Users,
} from "lucide-react";

import FormSection from "@/components/dashboard/FormSection";

import UserDetailItem from "./UserDetailItem";
import type { MockUserDetails } from "../data/mockUserDetails";

interface AccountInformationSectionProps {
  user: MockUserDetails;
}

export default function AccountInformationSection({
  user,
}: AccountInformationSectionProps) {
  return (
    <FormSection
      step="04"
      title="Account Information"
      description="Basic account record information."
      icon={<Clock3 size={21} />}
    >
      <UserDetailItem
        label="User ID"
        value={`#${user.id}`}
        icon={<Users size={16} />}
      />

      <UserDetailItem
        label="Created At"
        value={user.created_at}
        icon={<CalendarDays size={16} />}
      />

      <UserDetailItem
        label="Last Updated"
        value={user.updated_at}
        icon={<Clock3 size={16} />}
      />
    </FormSection>
  );
}
