import { Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import TaskCalendar from "~/components/tasks/taskCalendar";
import { api } from "~/utils/api";

export default function Tasks() {
  const { data: session } = useSession();
  const findTasksQuery = api.tasks.locateByAssignee;
  const assigneeId = session ? session.user.id : "";
  const { data: tasks, isFetching: loading } = findTasksQuery.useQuery(
    {
      assigneeId: assigneeId,
    },
    { enabled: session != null },
  );
  if (!session) return <>Please sign in</>;
  return (
    <>
      <h1 className="pb-5 text-6xl">Tasks</h1>
      {loading ? <Spinner>Loading...</Spinner> : <TaskCalendar tasks={tasks} />}
    </>
  );
}
