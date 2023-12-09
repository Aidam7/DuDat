import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import TaskTable from "~/components/tasks/table";
import TaskCalendar from "~/components/tasks/taskCalendar";
import { api } from "~/utils/api";

export default function Tasks() {
  const { data: session } = useSession();
  const findTasksQuery = api.tasks.locateByAssigneeAndTitle;
  let assigneeId = "";
  const [query, setQuery] = useState("");
  if (session) assigneeId = session.user.id;
  const [finishedTasksOpen, setFinishedTasksOpen] = useState(false);
  const [displayCalendar, setDisplayCalendar] = useState(true);
  const { data: tasks, isFetching: loading } = findTasksQuery.useQuery(
    {
      title: query,
      assigneeId: assigneeId,
    },
    { enabled: session != null },
  );
  if (!session) return <>Please sign in</>;
  const unConfirmedTasks = tasks?.filter(
    (task) => task.finishedOn != null && task.confirmedAsFinished == false,
  );
  const finishedTasks = tasks?.filter(
    (task) => task.finishedOn != null && task.confirmedAsFinished == true,
  );
  const ongoingTasks = tasks?.filter((task) => task.finishedOn == null);
  return (
    <>
      <h1 className="pb-5 text-6xl">Tasks</h1>
      <Button
        onClick={() => setDisplayCalendar(!displayCalendar)}
        className="mb-5"
        color="primary"
      >
        {displayCalendar ? "Show Tables" : "Show Calendar"}
      </Button>
      {displayCalendar ? (
        <>
          {ongoingTasks ? (
            <>
              <TaskCalendar tasks={ongoingTasks} />
            </>
          ) : (
            <TaskCalendar tasks={[]} />
          )}
        </>
      ) : (
        <>
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
          <h2 className="pb-5 text-4xl">Unconfirmed tasks</h2>
          {unConfirmedTasks ? (
            <TaskTable
              loading={loading}
              rows={unConfirmedTasks}
              link="/tasks/"
            />
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
      )}
    </>
  );
}
