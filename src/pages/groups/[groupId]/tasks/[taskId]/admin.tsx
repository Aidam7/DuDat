import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Code401 from "~/components/layout/errorCodes/401";
import Code404 from "~/components/layout/errorCodes/404";
import Loading from "~/components/layout/loading";
import PageHeader from "~/components/layout/pageHeader";
import TaskAddAssignments from "~/components/tasks/taskAddAssignments";
import TaskConfirmFinished from "~/components/tasks/taskConfirmFinished";
import TaskDelete from "~/components/tasks/taskDelete";
import TaskEdit from "~/components/tasks/taskEdit";
import TaskRemoveAssignments from "~/components/tasks/taskRemoveAssignments";
import { api } from "~/utils/api";
import { type IBreadcrumb } from "~/utils/types";
export default function TaskAdminPanel() {
  const router = useRouter();
  const taskId = router.query.taskId as string;
  const groupId = router.query.groupId as string;
  const { data: session } = useSession();
  const { data: task, isInitialLoading: loading } = api.tasks.getById.useQuery(
    { id: taskId },
    { enabled: session != null },
  );
  const { data: group } = api.groups.getById.useQuery({ id: groupId });
  if (loading) return <Loading />;
  if (
    task?.authorId != session?.user.id &&
    task?.group.ownerId != session?.user.id
  )
    return <Code401 />;
  if (!task || !group) return <Code404 />;
  const breadcrumbs: IBreadcrumb[] = [
    { name: "Groups", link: "/groups/" },
    { name: `${group.name}`, link: `/groups/${groupId}` },
    { name: "Tasks", link: `/groups/${groupId}` },
    { name: `${task.title}`, link: `/groups/${groupId}/tasks/${taskId}` },
    { name: "Admin Panel", link: "" },
  ];
  return (
    <div className="flex flex-col gap-5">
      <a href={`../${task.id}`}>
        <PageHeader
          name={task.title}
          description={task.description}
          breadcrumbs={breadcrumbs}
        />
      </a>
      <TaskConfirmFinished task={task} />
      <TaskAddAssignments group={group} task={task} />
      <TaskRemoveAssignments group={group} task={task} />
      <TaskEdit task={task} />
      <TaskDelete task={task} />
    </div>
  );
}
