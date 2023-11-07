import { useSession } from "next-auth/react";
import React, { useState } from "react";
import TaskTable from "~/components/tasks/table";
import { api } from "~/utils/api";
import { type ITableColumns } from "~/utils/types";

export default function Tasks() {
  const { data: session } = useSession();
  const findTasks = api.tasks.locateByAssigneeAndTitle;
  let assigneeId = "";
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  if (session) assigneeId = session.user.id;
  const { data: tasks } = findTasks.useQuery(
    {
      title: query,
      assigneeId: assigneeId,
    },
    { enabled: session != null, onSuccess: () => setLoading(false) },
  );
  if (!session) return <>Please sign in</>;
  const columns: ITableColumns[] = [
    { key: "title", label: "Title" },
    { key: "description", label: "Description" },
  ];
  return (
    <>
      <h1 className="pb-5 text-6xl">Tasks</h1>
      <input
        placeholder="Search for a task"
        className={"inner h-10 rounded-md pl-2 mb-5"}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value), setLoading(true);
        }}
      ></input>
      {tasks ? (
        <TaskTable columns={columns} loading={loading} rows={tasks} />
      ) : (
        <TaskTable columns={columns} loading={loading} rows={[]} />
      )}
    </>
  );
}
