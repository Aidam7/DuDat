import Link from "next/link";
import { useState } from "react";
import { api } from "~/utils/api";

export const GroupSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const { data: foundGroups } = api.groups.locateByName.useQuery({
    name: query,
  });
  return <><h2>Search group</h2><input value={query} onChange={(e) => setQuery(e.target.value)}></input>
  {foundGroups && foundGroups.length == 0 ? "We couldn't find anything" : foundGroups?.map((group)=>(
    <Link key={group.name} href={"../groups/" + group.id}>{group.name}</Link>
  ))}
  </>;
};
