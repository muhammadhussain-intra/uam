
import getEditUser from "./actions/getEditUser";
import EditUserForm from "./components/EditUserForm";

interface EditUserPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({
  params,
}: EditUserPageProps) {
  const { id } = await params;

  const result = await getEditUser(id);

  return <EditUserForm user={result.user} />;
}
