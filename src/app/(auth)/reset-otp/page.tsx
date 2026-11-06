import ReusableLayout from "@/components/auth/ReusableLayout";
import OtpVerificationForm from "@/app/(auth)/reset-otp/components/ResetPasswordOtpForm";
import { otpFeatures } from "./reset-password-otp.constants";

export default function VerifyOtpPage() {
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
      features={otpFeatures}
    >
      <OtpVerificationForm />
    </ReusableLayout>
  );
}
