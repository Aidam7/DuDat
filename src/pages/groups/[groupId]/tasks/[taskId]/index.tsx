import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import CategoryChipDisplay from "~/components/categories/categoryChipDisplay";
import Code404 from "~/components/layout/errorCodes/404";
import TaskActionPanel from "~/components/tasks/actionPanel/actionPanel";
import TaskManageCategories from "~/components/tasks/taskManageCategories";
import UserTable from "~/components/users/table";
import { api } from "~/utils/api";
import { formatDateToString } from "~/utils/func";
export default function TaskDetail() {
  const [displayCategoryManage, setDisplayCategoryManage] = useState(false);
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
  const { data: categories } = api.tasks.getCategories.useQuery(
    { taskId: taskId },
    { enabled: task != null && task != undefined },
  );
  if (!session) return <>Please sign in</>;
  if (loading) return <>Loading...</>;
  if (!task || !group) return <Code404 />;
  return (
    <>
      <h1 className="mb-5 text-6xl">{task.title}</h1>
      <CategoryChipDisplay categories={categories} />
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
      <TaskActionPanel task={task} group={group} assignees={assignees ?? []} />
      <div className="mb-5">
        <h2 className="text-4xl">Assignees</h2>
        {assignees ? (
          <UserTable rows={assignees} loading={loadingAssignees} />
        ) : (
          <UserTable rows={[]} loading={loadingAssignees} />
        )}
      </div>
      <div className="flex-co ml-auto flex gap-2">
        <Button
          color="warning"
          onClick={() => setDisplayCategoryManage(!displayCategoryManage)}
        >
          {displayCategoryManage
            ? "Close category panel"
            : "Open category panel"}
        </Button>
      </div>
      {displayCategoryManage && (
        <>
          <h2 className="text-4xl">Categories</h2>
          <TaskManageCategories
            task={task}
            link={`/groups/${groupId}/categories/`}
          />
        </>
      )}
    </>
  );
}
