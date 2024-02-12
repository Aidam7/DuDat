import { Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import PageHeader from "~/components/layout/pageHeader";
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
      <PageHeader name="Calendar" />
      {loading ? <Spinner>Loading...</Spinner> : <TaskCalendar tasks={tasks} />}
    </>
  );
}
