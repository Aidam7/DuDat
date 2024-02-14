import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import GroupAddMembers from "~/components/groups/groupAddMembership";
import GroupDelete from "~/components/groups/groupDelete";
import { GroupEdit } from "~/components/groups/groupEdit/groupEdit";
import GroupRemoveMembers from "~/components/groups/groupRemoveMembership/";
import GroupTransferOwnership from "~/components/groups/groupTransferOwnership/";
import Code401 from "~/components/layout/errorCodes/401";
import Code404 from "~/components/layout/errorCodes/404";
import Loading from "~/components/layout/loading";
import PageHeader from "~/components/layout/pageHeader";
import SignIn from "~/components/layout/signIn";
import { api } from "~/utils/api";
import { type IBreadcrumb } from "~/utils/types";

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
  if (status === "loading" || loading) return <Loading />;
  if (!session) return <SignIn />;
  if (!group) return <Code404 />;
  if (session.user.id != group.ownerId) return <Code401 />;
  const breadcrumbs: IBreadcrumb[] = [
    { name: "Groups", link: "../" },
    { name: `${group.name}`, link: `./` },
    { name: "Admin Panel", link: `` },
  ];
  return (
    <>
      <PageHeader
        name={group.name}
        description={group.description}
        breadcrumbs={breadcrumbs}
      />
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
