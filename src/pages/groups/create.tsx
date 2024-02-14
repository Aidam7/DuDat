import { useSession } from "next-auth/react";
import React from "react";
import GroupCreateForm from "~/components/groups/groupCreate";
import Loading from "~/components/layout/loading";
import PageHeader from "~/components/layout/pageHeader";
import SignIn from "~/components/layout/signIn";
import { type IBreadcrumb } from "~/utils/types";

const Create: React.FC = () => {
  const breadcrumbs: IBreadcrumb[] = [
    { name: "Groups", link: "./" },
    { name: `Create`, link: "." },
  ];
  const { data: session, status } = useSession();
  if (status === "loading") return <Loading />;
  if (!session) return <SignIn />;
  return (
    <>
      <PageHeader name="Create group" breadcrumbs={breadcrumbs} />
      <GroupCreateForm />
    </>
  );
};

export default Create;
