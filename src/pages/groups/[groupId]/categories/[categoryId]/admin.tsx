import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import CategoryDelete from "~/components/categories/categoryDelete";
import CategoryEdit from "~/components/categories/categoryEdit";
import Code401 from "~/components/layout/errorCodes/401";
import Code404 from "~/components/layout/errorCodes/404";
import Loading from "~/components/layout/loading";
import PageHeader from "~/components/layout/pageHeader";
import { api } from "~/utils/api";
import { type IBreadcrumb } from "~/utils/types";
export default function CategoryAdminPanel() {
  const router = useRouter();
  const categoryId = router.query.categoryId as string;
  const { data: session } = useSession();
  const { data: category, isInitialLoading: loading } =
    api.categories.getById.useQuery(
      { id: categoryId },
      { enabled: session != null },
    );
  if (loading) return <Loading />;
  if (!category) return <Code404 />;
  if (
    category.authorId != session?.user.id &&
    category.group.ownerId != session?.user.id
  )
    return <Code401 />;
  const breadcrumbs: IBreadcrumb[] = [
    { name: "Groups", link: "/groups" },
    { name: `${category.group.name}`, link: `/groups/${category.group.id}` },
    { name: "Categories", link: `/groups/${category.group.id}` },
    {
      name: `${category.name}`,
      link: `/groups/${category.group.id}/categories/${category.id}`,
    },
    { name: "Admin Panel", link: "." },
  ];
  return (
    <>
      <PageHeader
        name={category.name}
        description={category.description}
        breadcrumbs={breadcrumbs}
      />
      <div className="flex flex-col gap-5">
        <CategoryEdit category={category} />
        <CategoryDelete category={category} />
      </div>
    </>
  );
}
