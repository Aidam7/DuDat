import { Button, Input } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Loading from "~/components/layout/loading";
import PageHeader from "~/components/layout/pageHeader";
import TaskTable from "~/components/tasks/taskTable";
import { api } from "~/utils/api";

export default function Tasks() {
  const { data: session } = useSession();
  const findTasksQuery = api.tasks.locateByAssigneeAndTitle;
  let assigneeId = "";
  const [query, setQuery] = useState("");
  if (session) assigneeId = session.user.id;
  const [finishedTasksOpen, setFinishedTasksOpen] = useState(false);
  const { data: tasks, isFetching: loading } = findTasksQuery.useQuery(
    {
      title: query,
      assigneeId: assigneeId,
    },
    { enabled: session != null },
  );
  if (loading) return <Loading />;
  const unConfirmedTasks = tasks?.filter(
    (task) => task.finishedOn != null && task.confirmedAsFinished == false,
  );
  const finishedTasks = tasks?.filter(
    (task) => task.finishedOn != null && task.confirmedAsFinished == true,
  );
  const ongoingTasks = tasks?.filter((task) => task.finishedOn == null);
  return (
    <div className="flex flex-col gap-5">
      <PageHeader name="Tasks" breadcrumbs={[]} />
      <Input
        placeholder="Search for a task"
        value={query}
        onValueChange={setQuery}
      />
      <TaskTable loading={loading} rows={ongoingTasks} link="/tasks/" />
      <h2 className="pb-5 text-4xl font-semibold">Unconfirmed tasks</h2>
      <TaskTable loading={loading} rows={unConfirmedTasks} link="/tasks/" />
      <Button
        onClick={() => setFinishedTasksOpen(!finishedTasksOpen)}
        color="primary"
        className="w-1/4 max-md:w-full"
      >
        {finishedTasksOpen ? "▲ Close" : "▼ Open Finished Tasks"}
      </Button>
      {finishedTasksOpen && (
        <div>
          <h2 className="pb-5 text-4xl font-semibold">Finished tasks</h2>
          <TaskTable
            loading={loading}
            rows={finishedTasks}
            renderFinishedOn
            link={`/tasks/`}
          />
        </div>
      )}
    </div>
  );
}
