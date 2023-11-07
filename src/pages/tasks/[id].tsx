import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Code404 from "~/components/layout/404";
import { api } from "~/utils/api";
export default function TaskDetail() {
  const router = useRouter();
  const id = router.query.id as string;
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const { data: task } = api.tasks.getById.useQuery(
    { id },
    { enabled: session != null, onSuccess: () => setLoading(false) },
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
