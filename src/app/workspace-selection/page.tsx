 import ReusableLayout from "@/components/auth/ReusableLayout";

import WorkspaceSelectionForm from "./components/WorkspaceSelectionForm";
import { workspaceFeatures } from "./workspace-selection.constants";

export default function WorkspaceSelectionPage() {
  return (
    <ReusableLayout
      title={
        <>
          Choose your workspace.
          <br />
          Your access, your context.
        </>
      }
      description="Select the program you need to work in. Your available workspaces are based on your assigned access."
      features={workspaceFeatures}
    >
      <WorkspaceSelectionForm />
    </ReusableLayout>
  );
}