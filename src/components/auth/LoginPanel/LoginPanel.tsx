import { Button, Image } from "@nextui-org/react";
import { signIn, signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const LoginButton: React.FC = () => {
  const { data: sessionData } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <div className="flex items-center">
        <Link
          href={`/users/${sessionData?.user.id}`}
          className="flex items-center"
        >
          {sessionData?.user.image && (
            <Image
              src={sessionData.user.image}
              alt="Users avatar"
              width={48}
              height={48}
              className="mr-2 rounded-full"
            />
          )}
          {sessionData?.user.name && (
            <span className="pl-2 pr-4">{sessionData.user.name}</span>
          )}
        </Link>
        <Button
          color="primary"
          onClick={sessionData ? () => void signOut() : () => void signIn()}
        >
          {sessionData ? "Sign out" : "Sign in"}
        </Button>
      </div>
    </>
  );
};

export default LoginButton;
