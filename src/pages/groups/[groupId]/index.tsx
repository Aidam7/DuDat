import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Code401 from "~/components/layout/errorCodes/401";
import Code404 from "~/components/layout/errorCodes/404";
import TaskTable from "~/components/tasks/table";
import UserTable from "~/components/users/table";
import { api } from "~/utils/api";

export default function GroupDetail() {
  const router = useRouter();
  const groupId = router.query.groupId as string;
  const { data: session, status } = useSession();
  const isMemberOfGroupQuery = api.users.isMemberOfGroup;
  const isOwnerOfGroupQuery = api.users.isOwnerOfGroup;
  const findTasks = api.tasks.locateByName;
  const [finishedTasksOpen, setFinishedTasksOpen] = useState(false);
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
  const { data: tasksAndWishes, isFetching: loadingTasks } = findTasks.useQuery(
    {
      name: "",
      groupId,
    },
  );
  const { data: members, isFetching: loadingMembers } =
    api.users.locateByNameAndGroup.useQuery(
      {
        name: "",
        groupId,
      },
      {
        enabled: group != null,
      },
    );
  if (status === "loading" || loading) return <>Loading...</>;
  if (!session) return <>Please sign in</>;
  if (!group) return <Code404 />;
  if (isMemberLoading || isOwnerLoading || loadingTasks)
    return <>Authenticating...</>;
  if (!isMember) return <Code401 />;
  const wishes = tasksAndWishes?.filter(
    (task) => task.taskAssignment.length == 0 && task.finishedOn == null,
  );
  const finishedTasks = tasksAndWishes?.filter(
    (task) => task.finishedOn != null,
  );
  const tasks = tasksAndWishes?.filter(
    (task) => task.taskAssignment.length > 0 && task.finishedOn == null,
  );
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
      <div className="flex pb-5 max-md:flex-col md:space-x-4">
        <div className="w-[50%] max-md:w-[100%]">
          <h2 className="pb-5 text-4xl">Tasks</h2>
          {tasks ? (
            <TaskTable
              loading={loading}
              rows={tasks}
              doNotRenderGroup
              link={`/groups/${groupId}/tasks/`}
            />
          ) : (
            <TaskTable
              loading={loading}
              rows={[]}
              doNotRenderGroup
              link={`/groups/${groupId}/tasks/`}
            />
          )}
        </div>
        <div className="w-[50%] max-md:w-[100%]">
          <h2 className="pb-5 text-4xl">Wishes</h2>
          {wishes ? (
            <TaskTable
              loading={loading}
              rows={wishes}
              doNotRenderGroup
              link={`/groups/${groupId}/tasks/`}
            />
          ) : (
            <TaskTable
              loading={loading}
              rows={[]}
              doNotRenderGroup
              link={`/groups/${groupId}/tasks/`}
            />
          )}
        </div>
      </div>
      <div className="pb-5">
        <h2 className="pb-5 text-4xl">Members</h2>
        {members ? (
          <UserTable loading={loadingMembers} rows={members} />
        ) : (
          <UserTable loading={loadingMembers} rows={[]} />
        )}
      </div>
      <Button
        onClick={() => setFinishedTasksOpen(!finishedTasksOpen)}
        color="primary"
        className="w-1/4 max-md:w-full"
      >
        {finishedTasksOpen ? "▲ Close" : "▼ Open Finished Tasks"}
      </Button>
      {finishedTasksOpen && (
        <div className="pt-5">
          {finishedTasks ? (
            <TaskTable
              loading={loading}
              rows={finishedTasks}
              doNotRenderGroup
              link={`/groups/${groupId}/tasks/`}
            />
          ) : (
            <TaskTable
              loading={loading}
              rows={[]}
              doNotRenderGroup
              link={`/groups/${groupId}/tasks/`}
            />
          )}
        </div>
      )}
    </>
  );
}
