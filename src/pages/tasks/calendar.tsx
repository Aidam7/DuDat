import { useSession } from "next-auth/react";
import Loading from "~/components/layout/loading";
import PageHeader from "~/components/layout/pageHeader";
import TaskCalendar from "~/components/tasks/taskCalendar";
import { api } from "~/utils/api";

export default function TaskCalendarPage() {
  const { data: session } = useSession();
  const findTasksQuery = api.tasks.locateByAssignee;
  const assigneeId = session ? session.user.id : "";
  const { data: tasks, isFetching: loading } = findTasksQuery.useQuery(
    {
      assigneeId: assigneeId,
    },
    { enabled: session != null },
  );
  if (loading) return <Loading />;
  return (
    <>
      <PageHeader name="Calendar" breadcrumbs={[]} />
      <TaskCalendar tasks={tasks} />
    </>
  );
}
