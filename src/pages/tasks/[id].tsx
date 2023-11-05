import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";
export default function TaskDetail() {
  const router = useRouter();
  const id = router.query.id as string;
  const [loading, setLoading] = useState(true);
  const { data: task } = api.tasks.getById.useQuery(
    { id },
    { enabled: true, onSuccess: () => setLoading(false) },
  );
  if (loading) return <>Loading...</>;
  if (!task) return <>404</>;
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
