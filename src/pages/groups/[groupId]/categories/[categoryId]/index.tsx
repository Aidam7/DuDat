import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Code404 from "~/components/layout/errorCodes/404";
import Loading from "~/components/layout/loading";
import PageHeader from "~/components/layout/pageHeader";
import TaskTable from "~/components/tasks/taskTable";
import { api } from "~/utils/api";
import { type IBreadcrumb } from "~/utils/types";

export default function CategoryDetail() {
  const router = useRouter();
  const { data: session } = useSession();
  const categoryId = router.query.categoryId as string;
  const groupId = router.query.groupId as string;
  const { data: category, isInitialLoading: loading } =
    api.categories.getById.useQuery({ id: categoryId });
  const { data: tasks, isFetching: loadingTasks } =
    api.categories.getTasks.useQuery({ id: categoryId });
  if (loading) return <Loading />;
  if (!category) return <Code404 />;
  const isAuthor =
    category.authorId == session?.user.id ||
    category.group.ownerId == session?.user.id;
  const breadcrumbs: IBreadcrumb[] = [
    { name: "Groups", link: "/groups" },
    { name: `${category.group.name}`, link: `/groups/${category.group.id}` },
    { name: "Categories", link: `/groups/${category.group.id}` },
    { name: `${category.name}`, link: "." },
  ];
  return (
    <>
      <PageHeader
        name={category.name}
        description={category.description}
        breadcrumbs={breadcrumbs}
      />
      <div className="flex-co ml-auto flex gap-2">
        {isAuthor && (
          <Button
            color="warning"
            onClick={() =>
              router.push(`/groups/${groupId}/categories/${categoryId}/admin`)
            }
          >
            Settings
          </Button>
        )}
      </div>
      <h2 className="pb-5 text-4xl">Tasks</h2>
      <TaskTable
        loading={loadingTasks}
        rows={tasks}
        doNotRenderGroup
        renderFinishedOn
        link={`/groups/${groupId}/tasks/`}
      />
    </>
  );
}
