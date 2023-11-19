import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import GroupAddMembers from "~/components/groups/groupAddMembership/groupAddMembership";
import GroupDelete from "~/components/groups/groupDelete";
import { GroupEdit } from "~/components/groups/groupEdit/groupEdit";
import GroupRemoveMembers from "~/components/groups/groupRemoveMembership/";
import GroupTransferOwnership from "~/components/groups/groupTransferOwnership/";
import Code401 from "~/components/layout/errorCodes/401";
import Code404 from "~/components/layout/errorCodes/404";
import { api } from "~/utils/api";

export default function GroupDetail() {
  const router = useRouter();
  const groupId = router.query.id as string;
  const { data: session, status } = useSession();
  const isOwnerOfGroupQuery = api.users.isOwnerOfGroup;
  const { data: group, isFetching: loading } = api.groups.getById.useQuery(
    { id: groupId },
    {
      enabled: session != null,
    },
  );
  let userId = "";
  if (session) userId = session.user.id;
  const { data: isOwner, isFetching: authLoading } =
    isOwnerOfGroupQuery.useQuery(
      {
        groupId,
        userId,
      },
      {
        enabled: session != null && group != null,
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
      <div className="mb-5 w-full lg:w-[50%]">
        <div className="mb-5">
          <GroupEdit groupId={groupId} />
        </div>
        <GroupDelete groupId={groupId} />
      </div>
      <GroupTransferOwnership group={group} />
      <GroupRemoveMembers group={group} />
      <GroupAddMembers group={group} />
    </>
  );
}
