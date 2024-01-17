import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import GroupAddMembers from "~/components/groups/groupAddMembership";
import GroupDelete from "~/components/groups/groupDelete";
import { GroupEdit } from "~/components/groups/groupEdit/groupEdit";
import GroupRemoveMembers from "~/components/groups/groupRemoveMembership/";
import GroupTransferOwnership from "~/components/groups/groupTransferOwnership/";
import Code401 from "~/components/layout/errorCodes/401";
import Code404 from "~/components/layout/errorCodes/404";
import { api } from "~/utils/api";

export default function GroupAdminPanel() {
  //TODO: Remove onSuccess callbacks (issue #19)
  const router = useRouter();
  const groupId = router.query.groupId as string;
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const { data: group } = api.groups.getById.useQuery(
    { id: groupId },
    {
      enabled: session != null,
      onSuccess: () => setLoading(false),
    },
  );
  if (status === "loading") return <>Loading...</>;
  if (!session) return <>Please sign in</>;
  if (loading) return <>Loading...</>;
  if (!group) return <Code404 />;
  if (session.user.id != group.ownerId) return <Code401 />;
  return (
    <>
      <h1 className="text-6xl">{group.name} settings</h1>
      <div className="flex flex-col gap-10">
        <GroupEdit group={group} />
        <GroupTransferOwnership group={group} />
        <GroupRemoveMembers group={group} />
        <GroupAddMembers group={group} />
        <GroupDelete group={group} />
      </div>
    </>
  );
}
