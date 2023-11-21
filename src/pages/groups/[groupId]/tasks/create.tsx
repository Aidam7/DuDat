import { useRouter } from "next/router";
import React from "react";
import Code400 from "~/components/layout/errorCodes/400";
import TaskCreateForm from "~/components/tasks/taskCreate";

const Create: React.FC = () => {
  const router = useRouter();
  const groupId = router.query.groupId as string;
  if (!groupId) return <Code400 specifier="Invalid group ID" />;
  return (
    <>
      <TaskCreateForm groupId={groupId} />
    </>
  );
};

export default Create;
