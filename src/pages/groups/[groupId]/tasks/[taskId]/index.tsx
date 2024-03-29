import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import CategoryChipDisplay from "~/components/categories/categoryChipDisplay";
import Code404 from "~/components/layout/errorCodes/404";
import Loading from "~/components/layout/loading";
import PageHeader from "~/components/layout/pageHeader";
import TaskActionPanel from "~/components/tasks/taskActionPanel/taskActionPanel";
import TaskManageCategories from "~/components/tasks/taskManageCategories";
import TaskProgressBar from "~/components/tasks/taskProgressBar";
import UserTable from "~/components/users/table";
import { api } from "~/utils/api";
import { type IBreadcrumb } from "~/utils/types";
export default function TaskDetail() {
  const [displayCategoryManage, setDisplayCategoryManage] = useState(false);
  const router = useRouter();
  const taskId = router.query.taskId as string;
  const groupId = router.query.groupId as string;
  const { data: session } = useSession();
  const { data: task, isInitialLoading: loading } = api.tasks.getById.useQuery(
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
  if (loading) return <Loading />;
  if (!task || !group) return <Code404 />;
  const breadcrumbs: IBreadcrumb[] = [
    { name: "Groups", link: "/groups/" },
    { name: `${group.name}`, link: `/groups/${groupId}` },
    { name: "Tasks", link: `/groups/${groupId}` },
    { name: `${task.title}`, link: "." },
  ];
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row items-center max-sm:flex-col">
        <PageHeader
          name={task.title}
          description={task.description}
          breadcrumbs={breadcrumbs}
        />
        <TaskActionPanel
          task={task}
          group={group}
          assignees={assignees ?? []}
        />
      </div>
      <CategoryChipDisplay categories={categories} displayWrapper />
      <TaskProgressBar task={task} />
      <h2 className="text-4xl">Assignees</h2>
      <UserTable rows={assignees} loading={loadingAssignees} />
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
      <div className={`${!displayCategoryManage && "hidden"}`}>
        <h2 className="mb-5 text-4xl">Categories</h2>
        <TaskManageCategories
          task={task}
          link={`/groups/${groupId}/categories/`}
        />
      </div>
    </div>
  );
}
