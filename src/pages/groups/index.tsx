import { Button, Input } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import GroupTable from "~/components/groups/table";
import { api } from "~/utils/api";
import { type ITableColumns } from "~/utils/types";

export default function Groups() {
  const { data: session } = useSession();
  const findGroups = api.groups.locateByNameAndMember;
  const [query, setQuery] = useState("");
  let memberId = "";
  if (session) memberId = session.user.id;
  const { data: groups, isFetching: loading } = findGroups.useQuery(
    {
      name: query,
      memberId: memberId,
    },
    { enabled: session != null },
  );
  const router = useRouter();
  if (!session) return <>Please sign in</>;
  const columns: ITableColumns[] = [
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
  ];
  return (
    <>
      <div className="flex flex-row items-center">
        <h1 className="mb-5 text-6xl font-semibold">Groups</h1>
        <Button
          color="primary"
          className="mb-5 ml-auto w-min font-semibold"
          onClick={() => router.push("/groups/create")}
        >
          Create a new group
        </Button>
      </div>
      <Input
        placeholder="Search for a group"
        className="mb-5"
        value={query}
        onValueChange={setQuery}
      />
      <GroupTable columns={columns} loading={loading} rows={groups} />
    </>
  );
}
