import React, { type FC, type ReactNode } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Loading from "~/components/layout/loading";
import SignIn from "~/components/layout/signIn";
import Code500 from "~/components/layout/errorCodes/500";

type Props = {
  children: ReactNode;
};

const CheckAuth: FC<Props> = ({ children }) => {
  const router = useRouter();
  const isIndexPage = router.pathname === "/";
  const { status } = useSession();
  if (isIndexPage) return <>{children}</>;
  if (status === "loading") return <Loading />;
  if (status === "unauthenticated") return <SignIn />;
  if (status === "authenticated") return <>{children}</>;
  return <Code500 />;
};

export default CheckAuth;
