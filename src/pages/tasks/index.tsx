import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import TaskTable from "~/components/tasks/table";
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
  if (!session) return <>Please sign in</>;
  const finishedTasks = tasks?.filter((task) => task.finishedOn != null);
  const ongoingTasks = tasks?.filter((task) => task.finishedOn == null);
  return (
    <>
      <h1 className="pb-5 text-6xl">Tasks</h1>
      <input
        placeholder="Search for a task"
        className={"inner mb-5 h-10 rounded-md pl-2"}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      ></input>
      {ongoingTasks ? (
        <TaskTable loading={loading} rows={ongoingTasks} link="/tasks/" />
      ) : (
        <TaskTable loading={loading} rows={[]} link="/tasks/" />
      )}
      <Button
        onClick={() => setFinishedTasksOpen(!finishedTasksOpen)}
        color="primary"
        className="w-1/4 max-md:w-full"
      >
        {finishedTasksOpen ? "▲ Close" : "▼ Open Finished Tasks"}
      </Button>
      {finishedTasksOpen && (
        <div className="pt-5">
          {finishedTasks ? (
            <TaskTable
              loading={loading}
              rows={finishedTasks}
              renderFinishedOn
              link={`/tasks/`}
            />
          ) : (
            <TaskTable
              loading={loading}
              rows={[]}
              renderFinishedOn
              link={`/tasks/`}
            />
          )}
        </div>
      )}
    </>
  );
}
