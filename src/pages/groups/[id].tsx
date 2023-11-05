import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useState } from "react";

export default function GroupDetail() {
  const router = useRouter();
  const id = router.query.id as string;
  const [loading, setLoading] = useState(true);

  const { data: group } = api.groups.getById.useQuery(
    { id },
    {
      enabled: typeof id === "string",
      onSuccess: () => setLoading(false),
    },
  );
  if (loading) return <>Loading...</>;
  if (!group) return <>404</>;
  return (
    <>
      <h1 className="bg-slate-600 text-6xl">{group.id}</h1>
      {group.name}
    </>
  );
}
