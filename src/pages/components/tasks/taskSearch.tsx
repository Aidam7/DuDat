import { useState } from "react";
import { api } from "~/utils/api";

export const TaskSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  //This will later be removed and auto infered from the selected group
  const [groupId, setGroupId] = useState("");
  const { data: foundTasks } = api.tasks.locateByName.useQuery({
    name: query,
    groupId: groupId,
  });
  return (
    <>
      <h2>Search tasks</h2>
      <input
        title="Name"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      ></input>
      <input
        title="GroupId"
        value={groupId}
        onChange={(e) => setGroupId(e.target.value)}
      ></input>
      {foundTasks && foundTasks.length == 0
        ? "We couldn't find anything"
        : foundTasks?.map((task) => <p key={task.title}>{task.title}</p>)}
    </>
  );
};
