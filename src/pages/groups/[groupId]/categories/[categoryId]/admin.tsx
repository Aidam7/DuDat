import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import CategoryDelete from "~/components/categories/categoryDelete";
import CategoryEdit from "~/components/categories/categoryEdit";
import Code401 from "~/components/layout/errorCodes/401";
import Code404 from "~/components/layout/errorCodes/404";
import { api } from "~/utils/api";
export default function CategoryAdminPanel() {
  const router = useRouter();
  const categoryId = router.query.categoryId as string;
  const { data: session } = useSession();
  const { data: category, isFetching: loading } =
    api.categories.getById.useQuery(
      { id: categoryId },
      { enabled: session != null },
    );
  if (!session) return <>Please sign in</>;
  if (loading) return <>Loading...</>;
  if (!category) return <Code404 />;
  if (
    category.authorId != session.user.id &&
    category.group.ownerId != session.user.id
  )
    return <Code401 />;
  return (
    <>
      <h1 className="text-6xl">
        <a href={`../${category.id}`}>{category.name}</a>
      </h1>
      <div className="flex flex-col gap-5">
        <CategoryEdit category={category} />
        <CategoryDelete category={category} />
      </div>
    </>
  );
}
