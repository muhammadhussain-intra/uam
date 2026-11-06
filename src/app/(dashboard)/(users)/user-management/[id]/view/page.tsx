
import getViewUser from "./actions/getViewUser";
import ViewUserDetails from "./components/ViewUserDetails";

interface ViewUserPageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewUserPage({
  params,
}: ViewUserPageProps) {
  const { id } = await params;

  const result = await getViewUser(id);

  return <ViewUserDetails user={result.user} />;
}
