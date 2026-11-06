import ReusableLayout from "@/components/auth/ReusableLayout";

import BackupCodeForm from "./components/BackupCodeForm";
import { backupCodeFeatures } from "./backup-code.constants";

export default function BackupCodePage() {
  return (
    <ReusableLayout
      title={
        <>
          Stay prepared.
          <br />
          Never lose access.
        </>
      }
      description="Keep your account accessible with secure recovery codes when your primary authentication method is unavailable."
      features={backupCodeFeatures}
    >
      <BackupCodeForm />
    </ReusableLayout>
  );
}