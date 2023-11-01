import { Button } from "@nextui-org/react";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

const LoginButton: React.FC = () => {
  const { data: sessionData } = useSession();
  return (
    <>
      <p>
        {sessionData?.user.name && (
          <span className="pr-5">
            {sessionData.user.name.charAt(0).toUpperCase() +
              sessionData.user.name.slice(1)}
          </span>
        )}
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
