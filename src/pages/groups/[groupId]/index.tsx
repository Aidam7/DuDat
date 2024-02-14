import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import CategoryChipDisplay from "~/components/categories/categoryChipDisplay";
import GroupActionPanel from "~/components/groups/groupActionPanel";
import Code404 from "~/components/layout/errorCodes/404";
import Loading from "~/components/layout/loading";
import PageHeader from "~/components/layout/pageHeader";
import SignIn from "~/components/layout/signIn";
import TaskTable from "~/components/tasks/taskTable";
import UserTable from "~/components/users/table";
import { api } from "~/utils/api";
import { type IBreadcrumb } from "~/utils/types";

export default function GroupDetail() {
  const router = useRouter();
  const groupId = router.query.groupId as string;
  const { data: session, status } = useSession();
  const findTasks = api.tasks.locateByName;
  const [finishedTasksOpen, setFinishedTasksOpen] = useState(false);
  const { data: group, isFetching: loading } = api.groups.getById.useQuery(
    { id: groupId },
    {
      enabled: session != null,
    },
  );
  const { data: tasksAndWishes } = findTasks.useQuery({
    name: "",
    groupId,
  });
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
  const { data: categories, isFetching: loadingCategories } =
    api.categories.getByGroup.useQuery({ groupId }, { enabled: group != null });
  if (status === "loading" || loading) return <Loading />;
  if (!session) return <SignIn />;
  if (!group) return <Code404 />;
  const wishes = tasksAndWishes?.filter(
    (task) => task.taskAssignment.length == 0 && task.finishedOn == null,
  );
  const finishedTasks = tasksAndWishes?.filter(
    (task) => task.finishedOn != null,
  );
  const tasks = tasksAndWishes?.filter(
    (task) => task.taskAssignment.length > 0 && task.finishedOn == null,
  );
  const breadcrumbs: IBreadcrumb[] = [
    { name: "Groups", link: "./" },
    { name: `${group.name}`, link: "." },
  ];
  return (
    <>
      <div className="flex flex-row items-center max-sm:flex-col">
        <PageHeader
          name={group.name}
          description={group.description}
          breadcrumbs={breadcrumbs}
        />
        <GroupActionPanel group={group} />
      </div>
      <div className="flex flex-col gap-5 pb-5">
        <div>
          <h2 className="pb-5 text-4xl">Tasks</h2>
          <TaskTable
            loading={loading}
            rows={tasks}
            doNotRenderGroup
            link={`/groups/${groupId}/tasks/`}
          />
        </div>
        <div>
          <h2 className="pb-5 text-4xl">Wishes</h2>
          <TaskTable
            loading={loading}
            rows={wishes}
            doNotRenderGroup
            link={`/groups/${groupId}/tasks/`}
          />
        </div>
        <div>
          <CategoryChipDisplay
            loading={loadingCategories}
            categories={categories}
            displayHeader
            displayWrapper
          />
        </div>
        <div>
          <h2 className="pb-5 text-4xl">Members</h2>
          <UserTable loading={loadingMembers} rows={members} />
        </div>
        <Button
          onClick={() => setFinishedTasksOpen(!finishedTasksOpen)}
          color="primary"
          className="w-1/4 max-md:w-full"
        >
          {finishedTasksOpen ? "▲ Close" : "▼ Open Finished Tasks"}
        </Button>
        {finishedTasksOpen && (
          <div>
            <TaskTable
              loading={loading}
              rows={finishedTasks}
              doNotRenderGroup
              renderFinishedOn
              link={`/groups/${groupId}/tasks/`}
            />
          </div>
        )}
      </div>
    </>
  );
}
