import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import CategoryChipDisplay from "~/components/categories/categoryChipDisplay";
import Code404 from "~/components/layout/errorCodes/404";
import TaskManageCategories from "~/components/tasks/taskManageCategories";
import UserTable from "~/components/users/table";
import { api } from "~/utils/api";
import { formatDateToString } from "~/utils/func";
export default function TaskDetail() {
  const router = useRouter();
  const taskId = router.query.taskId as string;
  const groupId = router.query.groupId as string;
  const { data: session } = useSession();
  const { data: task, isFetching: loading } = api.tasks.getById.useQuery(
    { id: taskId },
    { enabled: session != null },
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
          task != null &&
          task != undefined &&
          group != null &&
          group != undefined,
      },
    );
  const { data: categories, isFetching: loadingCategories } =
    api.tasks.getCategories.useQuery(
      { taskId: taskId },
      { enabled: task != null && task != undefined },
    );
  const assignToTaskMutation = api.tasks.assignUser.useMutation();
  const unassignFromTaskMutation = api.tasks.unassignUser.useMutation();
  const markTaskASFinishedMutation = api.tasks.finishTask.useMutation();
  const resumeTaskMutation = api.tasks.resumeTask.useMutation();
  const apiUtils = api.useUtils();
  if (!session) return <>Please sign in</>;
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
      <h1 className="mb-5 text-6xl">{task.title}</h1>
      <CategoryChipDisplay
        categories={categories}
        loading={loadingCategories}
      />
      {task.description != "" ? (
        <span>{task.description}</span>
      ) : (
        <span className="italic text-gray-600">
          No description was provided
        </span>
      )}
      {task.dueOn ? (
        <>
          {task.finishedOn ? (
            <span className="italic text-gray-600">
              This task was due on {formatDateToString(task.dueOn)}
            </span>
          ) : (
            <>Finish this task before: {formatDateToString(task.dueOn)}</>
          )}
        </>
      ) : (
        <>
          {task.finishedOn ? (
            <span className="italic text-gray-600">
              This task could have been finished at any time
            </span>
          ) : (
            <span className="italic text-gray-600">
              You can finish this task anytime you want
            </span>
          )}
        </>
      )}
      {task.finishedOn && (
        <>
          Task was finished on {task.finishedOn.toLocaleDateString()}
          <br />{" "}
          {task.confirmedAsFinished ? (
            <span className="italic text-gray-600">
              Confirmed by the author
            </span>
          ) : (
            <span className="italic text-gray-600">
              Not yet confirmed by the author
            </span>
          )}
        </>
      )}
      <div className="flex-co ml-auto flex gap-2">
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
      <h2 className="text-4xl">Categories</h2>
      <TaskManageCategories
        task={task}
        link={`/groups/${groupId}/categories/`}
      />
    </>
  );
}
