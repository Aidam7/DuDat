import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import CategoryCreate from "~/components/categories/categoryCreate";
import Code404 from "~/components/layout/errorCodes/404";
import PageHeader from "~/components/layout/pageHeader";
import { api } from "~/utils/api";
import { type IBreadcrumb } from "~/utils/types";

function CreateCategory() {
  const router = useRouter();
  const groupId = router.query.groupId as string;
  const { data: session, status } = useSession();
  const { data: group, isFetching: loading } = api.groups.getById.useQuery(
    { id: groupId },
    { enabled: !!session },
  );
  if (status === "loading" || loading) return <div>Loading...</div>;
  if (!group) return <Code404 />;
  const breadcrumbs: IBreadcrumb[] = [
    { name: "Groups", link: "/groups" },
    { name: `${group.name}`, link: `/groups/${group.id}` },
    { name: "Categories", link: `/groups/${group.id}` },
    { name: "Create", link: "." },
  ];
  return (
    <>
      <PageHeader name="Create a category" breadcrumbs={breadcrumbs} />
      <CategoryCreate />
    </>
  );
}

export default CreateCategory;
