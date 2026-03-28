import React, { type FC, type ReactNode } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Loading from "~/components/layout/loading";
import SignIn from "~/components/layout/signIn";
import Code500 from "~/components/layout/errorCodes/500";
import { resolveAuthGateState } from "~/utils/authGate";

type Props = {
  children: ReactNode;
};

const CheckAuth: FC<Props> = ({ children }) => {
  const router = useRouter();
  const { status } = useSession();
  const state = resolveAuthGateState(router.pathname, status);

  if (state === "children") return <>{children}</>;
  if (state === "loading") return <Loading />;
  if (state === "signIn") return <SignIn />;
  return <Code500 />;
};

export default CheckAuth;
