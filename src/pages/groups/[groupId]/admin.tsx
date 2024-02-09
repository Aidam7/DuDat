import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import GroupAddMembers from "~/components/groups/groupAddMembership";
import GroupDelete from "~/components/groups/groupDelete";
import { GroupEdit } from "~/components/groups/groupEdit/groupEdit";
import GroupRemoveMembers from "~/components/groups/groupRemoveMembership/";
import GroupTransferOwnership from "~/components/groups/groupTransferOwnership/";
import Code401 from "~/components/layout/errorCodes/401";
import Code404 from "~/components/layout/errorCodes/404";
import PageHeader from "~/components/layout/pageHeader";
import { api } from "~/utils/api";

export default function GroupAdminPanel() {
  const router = useRouter();
  const groupId = router.query.groupId as string;

  const { data: session, status } = useSession();
  const { data: group, isFetching: loading } = api.groups.getById.useQuery(
    { id: groupId },
    {
      enabled: session != null,
    },
  );
  if (status === "loading" || loading) return <>Loading...</>;
  if (!session) return <>Please sign in</>;
  if (!group) return <Code404 />;
  if (session.user.id != group.ownerId) return <Code401 />;
  return (
    <>
      <a href={`../`} className="mb-5">
        <PageHeader name={group.name} description={group.description} />
      </a>
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
