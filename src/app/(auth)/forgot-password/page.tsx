import ReusableLayout from "@/components/auth/ReusableLayout";
import ForgotPasswordForm from "@/app/(auth)/forgot-password/components/ForgotPasswordForm";
import { forgotPasswordFeatures } from "./forgot-password.constants";

export default function ForgotPasswordPage() {
  return (
    <ReusableLayout
      title={
        <>
          Regain access.
          <br />
          Securely.
        </>
      }
      description="Recover your account using a verification code sent to your registered email."
      features={forgotPasswordFeatures}
    >
      <ForgotPasswordForm />
    </ReusableLayout>
  );
}
