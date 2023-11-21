import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Code401 from "~/components/layout/errorCodes/401";
import Code404 from "~/components/layout/errorCodes/404";
import TaskAddAssignments from "~/components/tasks/taskAddAssignments";
import { api } from "~/utils/api";
export default function TaskDetail() {
  const router = useRouter();
  const taskId = router.query.taskId as string;
  const groupId = router.query.groupId as string;
  const { data: session } = useSession();
  const { data: isMember, isFetching: authenticating } =
    api.users.isMemberOfGroup.useQuery(
      { groupId: groupId, userId: session?.user?.id ?? "" },
      { enabled: session != null },
    );
  const { data: task, isFetching: loading } = api.tasks.getById.useQuery(
    { id: taskId },
    { enabled: session != null && isMember },
  );
  const { data: group } = api.groups.getById.useQuery({ id: groupId });
  if (!session) return <>Please sign in</>;
  if (authenticating) return <>Authenticating...</>;
  if (!isMember) return <Code401 />;
  if (loading) return <>Loading...</>;
  if (!task || !group) return <Code404 />;
  return (
    <>
      <h1>{task.id}</h1>
      {task.description}
      <br></br>
      {task.authorId}
      <br></br>
      {task.title}
      <TaskAddAssignments group={group} task={task} />
    </>
  );
}
