import { useRouter } from "next/router";
import Code404 from "~/components/layout/errorCodes/404";
import TaskTable from "~/components/tasks/table";
import { api } from "~/utils/api";

export default function CategoryDetail() {
  const router = useRouter();
  const categoryId = router.query.categoryId as string;
  const groupId = router.query.groupId as string;
  const { data: category, isFetching: loading } =
    api.categories.getById.useQuery({ id: categoryId });
  const { data: tasks, isFetching: loadingTasks } =
    api.categories.getTasks.useQuery({ id: categoryId });
  if (loading) return <div>Loading...</div>;
  if (!category) return <Code404 />;
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
