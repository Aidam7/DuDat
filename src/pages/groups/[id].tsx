import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function GroupDetail() {
  const router = useRouter();
  const id = router.query.id as string;
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const { data: group } = api.groups.getById.useQuery(
    { id },
    {
      enabled: session != null,
      onSuccess: () => setLoading(false),
    },
  );
  if (!session) return <>Please sign in</>;
  if (loading) return <>Loading...</>;
  if (!group) return <>404</>;
  return (
    <>
      <h1 className="text-6xl">{group.name}</h1>
    </>
  );
}
