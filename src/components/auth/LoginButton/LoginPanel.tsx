import { Button } from "@nextui-org/react";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

const LoginButton: React.FC = () => {
  const { data: sessionData } = useSession();
  return (
    <>
      <p>
        {sessionData && <span>{sessionData.user?.name} </span>}
        <Button
          color="primary"
          onClick={sessionData ? () => void signOut() : () => void signIn()}
        >
          {sessionData ? "Sign out" : "Sign in"}
        </Button>
      </p>
    </>
  );
};

export default LoginButton;
