import { useSession } from "next-auth/react";
import Loading from "~/components/layout/loading";
import PageHeader from "~/components/layout/pageHeader";
import SignIn from "~/components/layout/signIn";
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
  if (!session) return <SignIn />;
  if (loading) return <Loading />;
  return (
    <>
      <PageHeader name="Calendar" breadcrumbs={[]} />
      <TaskCalendar tasks={tasks} />
    </>
  );
}
