import { Button, Input } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import GroupTable from "~/components/groups/groupTable";
import PageHeader from "~/components/layout/pageHeader";
import { api } from "~/utils/api";

export default function Groups() {
  const { data: session } = useSession();
  const findGroups = api.groups.locateByNameAndMember;
  const [query, setQuery] = useState("");
  let memberId = "";
  if (session) memberId = session.user.id;
  const { data: groups, isInitialLoading: loading } = findGroups.useQuery(
    {
      name: query,
      memberId: memberId,
    },
    { enabled: session != null },
  );
  const router = useRouter();
  return (
    <>
      <div className="mb-5 flex flex-col items-center gap-5 sm:flex-row">
        <PageHeader name="Groups" description="" breadcrumbs={[]} />
        <Button
          color="primary"
          className="ml-auto font-semibold max-sm:w-full"
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
      <GroupTable loading={loading} rows={groups} />
    </>
  );
}
