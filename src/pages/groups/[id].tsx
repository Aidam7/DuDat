import { useRouter } from "next/router";
import { api } from "~/utils/api";
export default function GroupDetail() {
  const router = useRouter();
  const id = router.query.id as string;
  let group;
  if (typeof id === "string") {
    const { data } = api.groups.getById.useQuery({ id });
    group = data;
  }
  return <>{group ? <><h1>{group.id}</h1><br></br>{group.name}</> : <>404</>}</>;
}
