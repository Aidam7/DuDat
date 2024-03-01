import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import Code401 from "~/components/layout/errorCodes/401";
import Code404 from "~/components/layout/errorCodes/404";
import Loading from "~/components/layout/loading";
import PageHeader from "~/components/layout/pageHeader";
import UserDelete from "~/components/users/userDelete";
import UserEdit from "~/components/users/userEdit";
import { api } from "~/utils/api";
import { type IBreadcrumb } from "~/utils/types";

export default function UserSettings() {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const id = router.query.id as string;
  const { data: user, isInitialLoading: loading } = api.users.getById.useQuery({
    id,
  });
  if (loading) return <Loading />;
  if (!user) return <Code404 />;
  const breadcrumbs: IBreadcrumb[] = [
    { name: "Users", link: "/" },
    { name: `${user?.name}`, link: `/users/${id}` },
    { name: "Settings", link: "." },
  ];
  if (user.id !== sessionData?.user.id) return <Code401 />;
  return (
    <div className="flex flex-col gap-5">
      <PageHeader name="Settings" breadcrumbs={breadcrumbs} />
      <div>
        <h2 className="mb-5 text-2xl font-semibold">Change your name</h2>
        <UserEdit user={user} />
      </div>
      <div>
        <h2 className="mb-5 text-2xl font-semibold">Delete your account</h2>
        <UserDelete user={user} />
      </div>
    </div>
  );
}
