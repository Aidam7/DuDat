import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import GroupDelete from "~/components/groups/groupDelete";
import { GroupEdit } from "~/components/groups/groupEdit/groupEdit";
import Code401 from "~/components/layout/errorCodes/401";
import Code404 from "~/components/layout/errorCodes/404";
import { api } from "~/utils/api";

export default function GroupDetail() {
  const router = useRouter();
  const groupId = router.query.id as string;
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const [authLoading, setAuthLoading] = useState(true);
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
  if (status === "loading") return <>Loading...</>;
  if (!session) return <>Please sign in</>;
  if (loading) return <>Loading...</>;
  if (!group) return <Code404 />;
  if (authLoading) return <>Authenticating...</>;
  if (!isOwner) return <Code401 />;
  return (
    <>
      <h1 className="text-6xl">{group.name} settings</h1>
      <div className="w-full sm:w-[25%]">
        <div className="mb-5">
          <GroupEdit groupId={groupId} />
        </div>
        <div className="sw:w-[25%] w-full">
          <GroupDelete groupId={groupId} />
        </div>
      </div>
    </>
  );
}
