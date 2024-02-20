import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import Code401 from "~/components/layout/errorCodes/401";
import Code404 from "~/components/layout/errorCodes/404";
import Loading from "~/components/layout/loading";
import PageHeader from "~/components/layout/pageHeader";
import UserDelete from "~/components/users/userDelete";
import { api } from "~/utils/api";
import { type IBreadcrumb } from "~/utils/types";

export default function UserSettings() {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const id = router.query.id as string;
  const { data: user, isFetching: loading } = api.users.getById.useQuery({
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
    <>
      <PageHeader name="Settings" breadcrumbs={breadcrumbs} />
      <UserDelete user={user} />
    </>
  );
}
