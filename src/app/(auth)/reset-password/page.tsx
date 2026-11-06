import ReusableLayout from "@/components/auth/ReusableLayout";
import ResetPasswordForm from "@/app/(auth)/reset-password/components/ResetPasswordForm";
import { resetPasswordFeatures } from "./reset-password.constants";

export default function ResetPasswordPage() {
  return (
    <ReusableLayout
      title={
        <>
          A stronger password
          <br />
          starts here.
        </>
      }
      description="Create a new password to restore secure access to your account."
      features={resetPasswordFeatures}
    >
      <ResetPasswordForm />
    </ReusableLayout>
  );
}
