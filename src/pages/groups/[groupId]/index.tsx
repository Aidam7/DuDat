import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import CategoryTable from "~/components/categories/categoryTable";
import GroupActionPanel from "~/components/groups/actionPanel";
import Code404 from "~/components/layout/errorCodes/404";
import TaskTable from "~/components/tasks/table";
import UserTable from "~/components/users/table";
import { api } from "~/utils/api";

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
  if (status === "loading" || loading) return <>Loading...</>;
  if (!session) return <>Please sign in</>;
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
  return (
    <>
      <h1 className="text-6xl">{group.name}</h1>
      {group.description != "" ? (
        <span>{group.description}</span>
      ) : (
        <span className="italic text-gray-600">
          No description was provided
        </span>
      )}
      <GroupActionPanel group={group} />
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
        <h2 className="pb-5 text-4xl">Task Categories</h2>
        {categories ? (
          <CategoryTable
            loading={loadingCategories}
            rows={categories}
            link={`/groups/${groupId}/categories/`}
          />
        ) : (
          <CategoryTable
            loading={loadingCategories}
            rows={[]}
            link={`/groups/${groupId}/categories/`}
          />
        )}
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
              renderFinishedOn
              link={`/groups/${groupId}/tasks/`}
            />
          ) : (
            <TaskTable
              loading={loading}
              rows={[]}
              doNotRenderGroup
              renderFinishedOn
              link={`/groups/${groupId}/tasks/`}
            />
          )}
        </div>
      )}
    </>
  );
}
