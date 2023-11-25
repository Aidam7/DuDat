import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Code401 from "~/components/layout/errorCodes/401";
import Code404 from "~/components/layout/errorCodes/404";
import UserTable from "~/components/users/table";
import { api } from "~/utils/api";
export default function TaskDetail() {
  const router = useRouter();
  const taskId = router.query.taskId as string;
  const groupId = router.query.groupId as string;
  const { data: session } = useSession();
  const { data: isMember, isFetching: authenticating } =
    api.users.isMemberOfGroup.useQuery(
      { groupId: groupId, userId: session?.user?.id ?? "" },
      { enabled: session != null },
    );
  const { data: task, isFetching: loading } = api.tasks.getById.useQuery(
    { id: taskId },
    { enabled: session != null && isMember },
  );
  const { data: group } = api.groups.getById.useQuery({ id: groupId });
  const { data: assignees, isFetching: loadingAssignees } =
    api.tasks.getAssignedMembers.useQuery(
      {
        taskId: taskId,
        groupId: groupId,
      },
      {
        enabled:
          (task != null || task != undefined) &&
          isMember &&
          (group != null || group != undefined),
      },
    );
  const assignToTaskMutation = api.tasks.assignUser.useMutation();
  const unassignFromTaskMutation = api.tasks.unassignUser.useMutation();
  const apiUtils = api.useUtils();
  if (!session) return <>Please sign in</>;
  if (authenticating) return <>Authenticating...</>;
  if (!isMember) return <Code401 />;
  if (loading) return <>Loading...</>;
  if (!task || !group) return <Code404 />;
  const isAuthor = task.authorId === session.user.id;
  const isAssigned = assignees?.some((u) => u.id === session.user.id);
  function handleAssignToTask() {
    if (!session || !task) return;
    return assignToTaskMutation.mutate(
      {
        taskId: task.id,
        userId: session.user.id,
      },
      {
        onSuccess: () => {
          void apiUtils.tasks.getAssignedMembers.invalidate();
        },
      },
    );
  }
  function handleUnassignFromTask() {
    if (!session || !task) return;
    return unassignFromTaskMutation.mutate(
      {
        taskId: task.id,
        userId: session.user.id,
      },
      {
        onSuccess: () => {
          void apiUtils.tasks.getAssignedMembers.invalidate();
        },
      },
    );
  }
  return (
    <>
      <h1 className="text-6xl">{task.title}</h1>
      {task.description != "" ? (
        <span>{task.description}</span>
      ) : (
        <span className="italic text-gray-600">
          No description was provided
        </span>
      )}
      <div className="ml-auto flex flex-col">
        {isAssigned ? (
          <Button
            color="danger"
            className="mb-2"
            onPress={handleUnassignFromTask}
          >
            Unassign from task
          </Button>
        ) : (
          <Button color="primary" className="mb-2" onPress={handleAssignToTask}>
            Assign to task
          </Button>
        )}
        {isAuthor && (
          <Button
            color="warning"
            onClick={() =>
              router.push(`/groups/${groupId}/tasks/${taskId}/admin`)
            }
          >
            Settings
          </Button>
        )}
      </div>
      <h2 className="text-4xl">Assignees</h2>
      {assignees ? (
        <UserTable rows={assignees} loading={loadingAssignees} />
      ) : (
        <UserTable rows={[]} loading={loadingAssignees} />
      )}
    </>
  );
}
