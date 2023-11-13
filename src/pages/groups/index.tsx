import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import GroupTable from "~/components/groups/table";
import { api } from "~/utils/api";
import { type ITableColumns } from "~/utils/types";
import { useRouter } from "next/navigation";

export default function Groups() {
  const { data: session } = useSession();
  const findGroups = api.groups.locateByNameAndMember;
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  let memberId = "";
  if (session) memberId = session.user.id;
  const { data: groups } = findGroups.useQuery(
    {
      name: query,
      memberId: memberId,
    },
    { enabled: session != null, onSuccess: () => setLoading(false) },
  );
  const router = useRouter();
  if (!session) return <>Please sign in</>;
  const columns: ITableColumns[] = [
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
  ];
  return (
    <>
      <h1 className="pb-5 text-6xl">Groups</h1>
      <Button
        color="primary"
        className="mb-5 ml-auto w-min"
        onClick={() => router.push("/groups/create")}
      >
        Create a new group
      </Button>
      <input
        placeholder="Search for a group"
        className={"inner mb-5 h-10 rounded-md pl-2"}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value), setLoading(true);
        }}
      ></input>
      {groups ? (
        <GroupTable columns={columns} loading={loading} rows={groups} />
      ) : (
        <GroupTable columns={columns} loading={loading} rows={[]} />
      )}
    </>
  );
}
