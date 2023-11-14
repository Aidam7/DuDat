import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Code404 from "~/components/layout/errorCodes/404";
import { Button } from "@nextui-org/react";
import TaskTable from "~/components/tasks/table";
import { ITableColumns } from "~/utils/types";

export default function GroupDetail() {
  const router = useRouter();
  const id = router.query.id as string;
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const { data: group } = api.groups.getById.useQuery(
    { id },
    {
      enabled: session != null,
      onSuccess: () => setLoading(false),
    },
  );
  const { data: isMemberOfGroup } = api.users.isMemberOfGroup.useQuery({
    groupId: id,
    userId: session?.user.id,
  });
  if (!session) return <>Please sign in</>;
  if (loading) return <>Loading...</>;
  if (!group) return <Code404 />;
  const columns: ITableColumns[] = [
    { key: "title", label: "Title" },
    { key: "description", label: "Description" },
  ];
  return (
    <>
      <h1 className="text-6xl">{group.name}</h1>
      <Button
        color="primary"
        className="mb-5 ml-auto w-min"
        onClick={() => router.push(`/tasks/create?groupId=${id}`)}
      >
        Create a new task
      </Button>
      <TaskTable />
    </>
  );
}
