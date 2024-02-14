import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import Code404 from "~/components/layout/errorCodes/404";
import Loading from "~/components/layout/loading";
import PageHeader from "~/components/layout/pageHeader";
import SignIn from "~/components/layout/signIn";
import TaskCreateForm from "~/components/tasks/taskCreate";
import { api } from "~/utils/api";
import { type IBreadcrumb } from "~/utils/types";

const Create: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const groupId = router.query.groupId as string;
  const { data: group } = api.groups.getById.useQuery(
    { id: groupId },
    { enabled: !!session },
  );
  if (status === "loading") return <Loading />;
  if (!session) return <SignIn />;
  if (!group) return <Code404 />;
  const breadcrumbs: IBreadcrumb[] = [
    { name: "Groups", link: ".../" },
    { name: `${group.name}`, link: "../" },
    { name: "Tasks", link: "../" },
    { name: "Create", link: "." },
  ];
  return (
    <>
      <PageHeader name="Create task" breadcrumbs={breadcrumbs} />
      <TaskCreateForm groupId={groupId} />
    </>
  );
};

export default Create;
