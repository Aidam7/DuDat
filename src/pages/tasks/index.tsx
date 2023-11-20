import { useSession } from "next-auth/react";
import { useState } from "react";
import TaskTable from "~/components/tasks/table";
import { api } from "~/utils/api";

export default function Tasks() {
  const { data: session } = useSession();
  const findTasks = api.tasks.locateByAssigneeAndTitle;
  let assigneeId = "";
  const [query, setQuery] = useState("");
  if (session) assigneeId = session.user.id;
  const { data: tasks, isFetching: loading } = findTasks.useQuery(
    {
      title: query,
      assigneeId: assigneeId,
    },
    { enabled: session != null },
  );
  if (!session) return <>Please sign in</>;
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
      {tasks ? (
        <TaskTable loading={loading} rows={tasks} />
      ) : (
        <TaskTable loading={loading} rows={[]} />
      )}
    </>
  );
}
