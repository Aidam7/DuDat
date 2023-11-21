import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Code404 from "~/components/layout/errorCodes/404";
import { api } from "~/utils/api";
export default function TaskDetail() {
  const router = useRouter();
  const taskId = router.query.taskId as string;
  const groupId = router.query.groupId as string;
  const { data: session } = useSession();

  const { data: task, isFetching: loading } = api.tasks.getById.useQuery(
    { id: taskId },
    { enabled: session != null },
  );
  if (!session) return <>Please sign in</>;
  if (loading) return <>Loading...</>;
  if (!task) return <Code404 />;
  return (
    <>
      <h1>{task.id}</h1>
      {task.description}
      <br></br>
      {task.authorId}
      <br></br>
      {task.title}
    </>
  );
}
