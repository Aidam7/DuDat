import React from "react";
import GroupCreateForm from "~/components/groups/groupCreate";
import PageHeader from "~/components/layout/pageHeader";
import { type IBreadcrumb } from "~/utils/types";

const GroupCreate: React.FC = () => {
  const breadcrumbs: IBreadcrumb[] = [
    { name: "Groups", link: "./" },
    { name: `Create`, link: "." },
  ];
  return (
    <div className="flex flex-col gap-5">
      <PageHeader name="Create group" breadcrumbs={breadcrumbs} />
      <GroupCreateForm />
    </div>
  );
};

export default GroupCreate;
