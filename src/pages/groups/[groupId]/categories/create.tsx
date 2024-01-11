import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import CategoryCreate from "~/components/categories/categoryCreate";
import Code401 from "~/components/layout/errorCodes/401";
import { api } from "~/utils/api";

function CreateCategory() {
  const router = useRouter();
  const groupId = router.query.groupId as string;
  const { data: session, status } = useSession();
  const { data: isMember, isFetching: loading } =
    api.users.isMemberOfGroup.useQuery(
      {
        groupId: groupId,
        userId: session?.user ? session.user.id : "",
      },
      {
        enabled: session?.user != null,
      },
    );
  if (status === "loading" || loading) return <div>Loading...</div>;
  if (!isMember) return <Code401 />;
  return <CategoryCreate />;
}

export default CreateCategory;
