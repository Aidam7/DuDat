import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Code404 from "~/components/layout/errorCodes/404";
import { api } from "~/utils/api";
export default function TaskDetail() {
  const router = useRouter();
  const id = router.query.taskId as string;
  const { data: session } = useSession();
  console.log(id);
  const { data: task, isFetching: loading } = api.tasks.getById.useQuery(
    { id },
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
