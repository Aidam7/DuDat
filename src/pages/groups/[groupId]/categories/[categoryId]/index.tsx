import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Code404 from "~/components/layout/errorCodes/404";
import TaskTable from "~/components/tasks/taskTable";
import { api } from "~/utils/api";

export default function CategoryDetail() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const categoryId = router.query.categoryId as string;
  const groupId = router.query.groupId as string;
  const { data: category, isFetching: loading } =
    api.categories.getById.useQuery({ id: categoryId });
  const { data: tasks, isFetching: loadingTasks } =
    api.categories.getTasks.useQuery({ id: categoryId });
  if (loading || status == "loading") return <div>Loading...</div>;
  if (!session) return <>Please sign in</>;
  if (!category) return <Code404 />;
  const isAuthor =
    category.authorId == session.user.id ||
    category.group.ownerId == session.user.id;
  return (
    <>
      <h1 className="text-6xl">{category.name}</h1>
      {category.description != "" ? (
        <span>{category.description}</span>
      ) : (
        <span className="italic text-gray-600">
          No description was provided
        </span>
      )}
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
      {tasks ? (
        <TaskTable
          loading={loadingTasks}
          rows={tasks}
          doNotRenderGroup
          renderFinishedOn
          link={`/groups/${groupId}/tasks/`}
        />
      ) : (
        <TaskTable
          loading={loadingTasks}
          rows={[]}
          doNotRenderGroup
          renderFinishedOn
          link={`/groups/${groupId}/tasks/`}
        />
      )}
    </>
  );
}
