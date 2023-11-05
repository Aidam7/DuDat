import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { api } from "~/utils/api";

export default function Groups() {
  const { data: session } = useSession();
  const findGroups = api.groups.locateByNameAndMember;
  let memberId = "";
  if (session) memberId = session.user.id;
  const { data: groups } = findGroups.useQuery({
    name: "",
    memberId: memberId,
  });
  if (!session)
    return (
      <>
        <p>Please sign in</p>
      </>
    );
  return (
    <>
      <h1 className="pb-5 text-6xl">Groups</h1>
      {groups && groups.length == 0
        ? "We couldn't find any groups you would be a member of :("
        : groups?.map((group) => (
            <Link key={group.name} href={"../groups/" + group.id}>
              {group.name}
            </Link>
          ))}
    </>
  );
}
