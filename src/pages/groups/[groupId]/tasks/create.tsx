import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import Code404 from "~/components/layout/errorCodes/404";
import TaskCreateForm from "~/components/tasks/taskCreate";
import { api } from "~/utils/api";

const Create: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const groupId = router.query.groupId as string;
  const { data: isMember, isFetching: authenticating } =
    api.users.isMemberOfGroup.useQuery(
      { groupId: groupId, userId: session?.user?.id ?? "" },
      { enabled: session != null },
    );
  if (!session) return <>Please sign in</>;
  if (authenticating) return <>Authenticating...</>;
  if (!isMember && !authenticating) return <Code404 />;
  return (
    <>
      <TaskCreateForm groupId={groupId} />
    </>
  );
};

export default Create;
