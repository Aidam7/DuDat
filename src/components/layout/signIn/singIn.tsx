import { Button } from "@nextui-org/react";
import { signOut, signIn, useSession } from "next-auth/react";
import React, { type FC } from "react";
import CenteredLayout from "../centeredLayout";

const SignIn: FC = () => {
  const { data: sessionData } = useSession();
  return (
    <CenteredLayout>
      <h1 className="text-4xl font-semibold">
        You need to sign in to access this page
      </h1>
      <Button
        color="primary"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
        className="w-[80%] text-2xl font-semibold"
      >
        {sessionData ? "Sign out" : "Sign in"}
      </Button>
    </CenteredLayout>
  );
};

export default SignIn;
