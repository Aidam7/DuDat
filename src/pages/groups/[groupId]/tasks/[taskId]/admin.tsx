import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Code401 from "~/components/layout/errorCodes/401";
import Code404 from "~/components/layout/errorCodes/404";
import TaskAddAssignments from "~/components/tasks/taskAddAssignments";
import TaskRemoveAssignments from "~/components/tasks/taskRemoveAssignments";
import { api } from "~/utils/api";
export default function TaskAdminPanel() {
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
  const confirmTaskAsFinishedMutation =
    api.tasks.confirmTaskAsFinished.useMutation();
  if (!session) return <>Please sign in</>;
  if (authenticating) return <>Authenticating...</>;
  if (!isMember || task?.authorId != session.user.id) return <Code401 />;
  if (loading) return <>Loading...</>;
  if (!task || !group) return <Code404 />;
  function handleConfirmTaskAsFinished() {
    if (!session || !task || task.confirmedAsFinished) return;
    return confirmTaskAsFinishedMutation.mutate(
      {
        taskId: task.id,
      },
      {
        onSuccess: () => {
          task.confirmedAsFinished = true;
        },
      },
    );
  }
  return (
    <>
      <h1 className="text-6xl">
        <a href={`../${task.id}`}>{task.title}</a>
      </h1>
      {/*bruh*/}
      <Button
        color={task.confirmedAsFinished ? "default" : "success"}
        onPress={handleConfirmTaskAsFinished}
        disabled={task.confirmedAsFinished ? true : false}
        className="w-fit"
      >
        {task.confirmedAsFinished
          ? "Confirmed as finished"
          : "Confirm as finished"}
      </Button>
      <TaskAddAssignments group={group} task={task} />
      <TaskRemoveAssignments group={group} task={task} />
    </>
  );
}
