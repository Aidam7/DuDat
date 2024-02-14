import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { type Task, type Group, type User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { type FC } from "react";
import { api } from "~/utils/api";
interface Props {
  task: Task;
  group: Group;
  assignees: User[];
}
const TaskActionPanel: FC<Props> = (props: Props) => {
  const { task, group, assignees } = props;
  const router = useRouter();
  const { data: session } = useSession();
  const assignToTaskMutation = api.tasks.assignUser.useMutation();
  const unassignFromTaskMutation = api.tasks.unassignUser.useMutation();
  const markTaskASFinishedMutation = api.tasks.finishTask.useMutation();
  const resumeTaskMutation = api.tasks.resumeTask.useMutation();
  const apiUtils = api.useUtils();
  if (!session) return null;
  const hasPerm =
    task.authorId == session.user.id || group.ownerId == session.user.id;
  const isAssigned = assignees?.some((u) => u.id === session.user.id);
  const groupId = group.id;
  const taskId = task.id;
  const actions = (
    <>
      {isAssigned ? (
        <>
          {task.finishedOn == null ? (
            <Button color="success" onPress={handleFinishTask}>
              Finish Task
            </Button>
          ) : (
            <Button color="danger" onPress={handleResumeTask}>
              Resume this task
            </Button>
          )}
          <Button color="danger" onPress={handleUnassignFromTask}>
            Unassign from task
          </Button>
        </>
      ) : (
        <Button color="primary" onPress={handleAssignToTask}>
          Assign to task
        </Button>
      )}
      {hasPerm && (
        <Button
          color="warning"
          onClick={() =>
            router.push(`/groups/${groupId}/tasks/${taskId}/admin`)
          }
        >
          Settings
        </Button>
      )}
    </>
  );
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
  function handleFinishTask() {
    if (!session || !task) return;
    return markTaskASFinishedMutation.mutate(
      {
        taskId: task.id,
      },
      {
        onSuccess: () => {
          task.finishedOn = new Date();
        },
      },
    );
  }
  function handleResumeTask() {
    if (!session || !task) return;
    return resumeTaskMutation.mutate(
      {
        taskId: task.id,
      },
      {
        onSuccess: () => {
          task.finishedOn = null;
          task.confirmedAsFinished = false;
        },
      },
    );
  }
  return (
    <>
      <div className="ml-auto flex flex-row gap-2 max-lg:hidden">{actions}</div>
      <div className="ml-auto lg:hidden">
        <Popover>
          <PopoverTrigger>
            <Button>
              <span className="text-lg">Action Panel</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col gap-2">{actions}</div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

export default TaskActionPanel;
