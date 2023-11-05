import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { api } from "~/utils/api";

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
  if (!session) return <>Please sign in</>;
  return (
    <>
      <h1 className="pb-5 text-6xl">Groups</h1>
      <input
        placeholder="Search for a group"
        className={"inner h-10 rounded-md pl-2"}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value), setLoading(true);
        }}
      ></input>
      {loading && <>Loading...</>}
      {groups?.length == 0 && "We couldn't find anything"}
      {groups?.map((group) => (
        <Link key={group.name} href={"../groups/" + group.id}>
          {group.name}
        </Link>
      ))}
    </>
  );
}
