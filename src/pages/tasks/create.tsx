import React from "react";
import TaskCreateForm from "~/components/tasks/taskCreate";
import { useRouter, useSearchParams } from "next/navigation";
import Code400 from "~/components/layout/errorCodes/400";

const Create: React.FC = () => {
  const router = useRouter();
  const groupId = useSearchParams().get("groupId");
  if (!groupId) return <Code400 specifier="Invalid group ID" />;
  return (
    <>
      <TaskCreateForm groupId={groupId} />
    </>
  );
};

export default Create;
