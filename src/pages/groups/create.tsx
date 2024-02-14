import React from "react";
import GroupCreateForm from "~/components/groups/groupCreate";
import PageHeader from "~/components/layout/pageHeader";
import { type IBreadcrumb } from "~/utils/types";

const Create: React.FC = () => {
  const breadcrumbs: IBreadcrumb[] = [
    { name: "Groups", link: "./" },
    { name: `Create`, link: "." },
  ];
  return (
    <>
      <PageHeader name="Create group" breadcrumbs={breadcrumbs} />
      <GroupCreateForm />
    </>
  );
};

export default Create;
