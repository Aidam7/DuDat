import { Button } from "@nextui-org/react";
import { signOut, signIn, useSession } from "next-auth/react";
import React, { type FC } from "react";

const SignIn: FC = () => {
  const { data: sessionData } = useSession();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 text-center">
      <h1 className="text-4xl font-semibold">
        You need to sign in to access this page
      </h1>
      <Button
        color="primary"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
        className="w-full text-2xl font-semibold"
      >
        {sessionData ? "Sign out" : "Sign in"}
      </Button>
    </div>
  );
};

export default SignIn;
