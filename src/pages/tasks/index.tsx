import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { api } from "~/utils/api";

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
  return (
    <>
      <h1 className="pb-5 text-6xl">Tasks</h1>
      <input
        placeholder="Search for a task"
        className={"inner h-10 rounded-md pl-2"}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value), setLoading(true);
        }}
      ></input>
      {loading && <>Loading...</>}
      {tasks && tasks.length == 0 && "We couldn't find anything"}
      {tasks?.map((task) => (
        <Link key={task.title} href={"../tasks/" + task.id}>
          {task.title}
        </Link>
      ))}
    </>
  );
}
