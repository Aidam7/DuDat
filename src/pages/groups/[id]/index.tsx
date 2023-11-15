import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@nextui-org/react";
import Code404 from "~/components/layout/errorCodes/404";
import Code401 from "~/components/layout/errorCodes/401";

export default function GroupDetail() {
  const router = useRouter();
  const groupId = router.query.id as string;
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [authLoading, setAuthLoading] = useState(true);
  const isMemberOfGroupQuery = api.users.isMemberOfGroup;
  const isOwnerOfGroupQuery = api.users.isOwnerOfGroup;
  const { data: group } = api.groups.getById.useQuery(
    { id: groupId },
    {
      enabled: session != null,
      onSuccess: () => setLoading(false),
    },
  );
  let userId = "";
  if (session) userId = session.user.id;
  const { data: isMember } = isMemberOfGroupQuery.useQuery(
    {
      groupId,
      userId,
    },
    {
      enabled: session != null && group != null,
      onSuccess: () => setAuthLoading(false),
    },
  );
  const { data: isOwner } = isOwnerOfGroupQuery.useQuery(
    {
      groupId,
      userId,
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
      <div className="ml-auto flex flex-col">
        <Button
          color="primary"
          onClick={() => router.push(`/tasks/create?groupId=${groupId}`)}
          className="mb-2"
        >
          Create a new task
        </Button>
        {isOwner && (
          <Button
            color="warning"
            onClick={() => router.push(`${groupId}/admin`)}
          >
            Settings
          </Button>
        )}
      </div>
    </>
  );
}
