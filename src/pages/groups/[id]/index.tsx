import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Code401 from "~/components/layout/errorCodes/401";
import Code404 from "~/components/layout/errorCodes/404";
import TaskTable from "~/components/tasks/table";
import { api } from "~/utils/api";

export default function GroupDetail() {
  const router = useRouter();
  const groupId = router.query.id as string;
  const { data: session, status } = useSession();
  const isMemberOfGroupQuery = api.users.isMemberOfGroup;
  const isOwnerOfGroupQuery = api.users.isOwnerOfGroup;
  const findTasks = api.tasks.locateByName;
  const { data: group, isFetching: loading } = api.groups.getById.useQuery(
    { id: groupId },
    {
      enabled: session != null,
    },
  );
  let userId = "";
  if (session) userId = session.user.id;
  const { data: isMember, isFetching: isMemberLoading } =
    isMemberOfGroupQuery.useQuery(
      {
        groupId,
        userId,
      },
      {
        enabled: session != null && group != null,
      },
    );
  const { data: isOwner, isFetching: isOwnerLoading } =
    isOwnerOfGroupQuery.useQuery(
      {
        groupId,
        userId,
      },
      {
        enabled: session != null && group != null,
      },
    );
  const { data: tasks, isFetching: loadingTasks } = findTasks.useQuery({
    name: "",
    groupId,
  });
  if (status === "loading" || loading) return <>Loading...</>;
  if (!session) return <>Please sign in</>;
  if (!group) return <Code404 />;
  if (isMemberLoading || isOwnerLoading || loadingTasks)
    return <>Authenticating...</>;
  if (!isMember) return <Code401 />;
  return (
    <>
      <h1 className="text-6xl">{group.name}</h1>
      <div className="ml-auto flex flex-col">
        <Button
          color="primary"
          onClick={() => router.push(`/groups/${groupId}/tasks/create`)}
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
      {tasks ? (
        <TaskTable loading={loading} rows={tasks} />
      ) : (
        <TaskTable loading={loading} rows={[]} />
      )}
    </>
  );
}
