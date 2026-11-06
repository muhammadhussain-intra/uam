import ReusableLayout from "@/components/auth/ReusableLayout";

import FactorChoiceForm from "./components/FactorChoiceForm";
import { factorChoiceFeatures } from "./factor-choice.constants";

export default function FactorChoicePage() {
  return (
    <ReusableLayout
      title={
        <>
          Multiple layers
          <br />
          of security.
        </>
      }
      description="Secure your account with single sign-on and multi-factor authentication across your education network."
      features={factorChoiceFeatures}
    >
      <FactorChoiceForm />
    </ReusableLayout>
  );
}