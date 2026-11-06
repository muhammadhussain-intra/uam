
import {
  UserRound,
  Mail,
  AtSign,
} from "lucide-react";

import FormSection from "@/components/dashboard/FormSection";

import UserDetailItem from "./UserDetailItem";
import type { MockUserDetails } from "../data/mockUserDetails";

interface PersonalInformationSectionProps {
  user: MockUserDetails;
}

export default function PersonalInformationSection({
  user,
}: PersonalInformationSectionProps) {
  return (
    <FormSection
      step="01"
      title="Personal Information"
      description="Basic identity and contact information."
      icon={<UserRound size={21} />}
    >
      <UserDetailItem
        label="Full Name"
        value={user.full_name}
        icon={<UserRound size={16} />}
      />

      <UserDetailItem
        label="Email Address"
        value={user.email}
        icon={<Mail size={16} />}
      />

      <UserDetailItem
        label="Username"
        value={user.username}
        icon={<AtSign size={16} />}
      />
    </FormSection>
  );
}
