import { useRouter } from "next/router";
import { api } from "~/utils/api";
export default function TaskDetail() {
  const router = useRouter();
  const id = router.query.id as string;
  let task;
  if (typeof id === "string") {
    const { data } = api.tasks.getById.useQuery({ id });
    task = data;
  }
  return <>{task ? <><h1>{task.id}</h1>{task.description}<br></br>{task.authorId}<br></br>{task.title}</> : <>404</>}</>;
}
