import ReusableLayout from "@/components/auth/ReusableLayout";
import LoginForm from "@/app/(auth)/login/components/LoginForm";
import { loginFeatures } from "./login.constants";

export default function LoginPage() {
  return (
    <ReusableLayout
      title={
        <>
          One platform.
          <br />
          Every level of education.
        </>
      }
      description="Securely manage users, roles, and access across your education network."
      features={loginFeatures}
    >
      <LoginForm />
    </ReusableLayout>
  );
}
