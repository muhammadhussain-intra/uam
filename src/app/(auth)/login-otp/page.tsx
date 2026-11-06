import ReusableLayout from "@/components/auth/ReusableLayout";
import OtpVerificationForm from "@/app/(auth)/login-otp/components/LoginOtpVerificationForm";
import { otpFeatures } from "./login-otp-verification.constants";

export default function VerifyOtpPage() {
  return (
    <ReusableLayout
      title={
        <>
          One more step.
          <br />
          Stay secure.
        </>
      }
      description="An additional verification step helps ensure that only you can access your account."
      features={otpFeatures}
    >
      <OtpVerificationForm />
    </ReusableLayout>
  );
}