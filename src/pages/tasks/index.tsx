import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { api } from "~/utils/api";

export default function Tasks() {
  const { data: session } = useSession();
  const findTasks = api.tasks.locateByAssigneeAndTitle;
  let assigneeId = "";
  if (session) assigneeId = session.user.id;
  const { data: tasks } = findTasks.useQuery({
    title: "",
    assigneeId: assigneeId,
  });
  if (!session)
    return (
      <>
        <p>Please sign in</p>
      </>
    );
  return (
    <>
      <h1 className="pb-5 text-6xl">Tasks</h1>
      {tasks && tasks.length == 0
        ? "We couldn't find any taks you'd be assigned to :("
        : tasks?.map((task) => (
            <Link key={task.title} href={"../tasks/" + task.id}>
              {task.title}
            </Link>
          ))}
    </>
  );
}
