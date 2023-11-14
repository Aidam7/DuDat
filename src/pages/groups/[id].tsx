import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Code404 from "~/components/layout/errorCodes/404";
import { Button } from "@nextui-org/react";
import Code401 from "~/components/layout/errorCodes/401";

export default function GroupDetail() {
  const router = useRouter();
  const id = router.query.id as string;
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [authLoading, setAuthLoading] = useState(true);
  const isMemberOfGroupQuery = api.users.isMemberOfGroup;
  const { data: group } = api.groups.getById.useQuery(
    { id },
    {
      enabled: session != null,
      onSuccess: () => setLoading(false),
    },
  );
  let memberId = "";
  if (session) memberId = session.user.id;
  const { data: isMember } = isMemberOfGroupQuery.useQuery(
    {
      groupId: id,
      userId: memberId,
    },
    {
      enabled: session != null && group != null,
      onSuccess: () => setAuthLoading(false),
    },
  );
  if (!session) return <>Please sign in</>;
  if (loading) return <>Loading...</>;
  if (!group) return <Code404 />;
  if (authLoading) return <>Authenticating...</>;
  if (!isMember) return <Code401 />;
  return (
    <>
      <h1 className="text-6xl">{group.name}</h1>
      <Button
        color="primary"
        className="mb-5 ml-auto w-min"
        onClick={() => router.push(`/tasks/create?groupId=${id}`)}
      >
        Create a new task
      </Button>
    </>
  );
}
