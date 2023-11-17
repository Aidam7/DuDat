import { Button } from "@nextui-org/react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

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
            <>
              {/* Due to using the google provider we need to use the img tag
              instead of next/image as the google profile picture sometimes had
              trouble loading */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sessionData.user.image}
                alt={`${sessionData.user.name}'s avatar`}
                className="mr-2 rounded-full max-md:hidden"
                height={48}
                width={48}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sessionData.user.image}
                alt={`${sessionData.user.name}'s avatar`}
                className="mr-2 rounded-full md:hidden"
                height={24}
                width={24}
              />
            </>
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
