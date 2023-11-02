import { Button, Image, Link } from "@nextui-org/react";
import { signIn, signOut, useSession } from "next-auth/react";
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
      <p>
        <div className="flex items-center">
          <Link href="#" className="text-foreground">
            {sessionData?.user.image && (
              <Image
                src={sessionData.user.image}
                alt="Users avatar"
                width={48}
                height={48}
                className="rounded-full"
              />
            )}
            {sessionData?.user.name && (
              <span className="pl-2 pr-4">
                {sessionData.user.name.charAt(0).toUpperCase() +
                  sessionData.user.name.slice(1)}
              </span>
            )}
          </Link>
          <Button
            color="primary"
            onClick={sessionData ? () => void signOut() : () => void signIn()}
          >
            {sessionData ? "Sign out" : "Sign in"}
          </Button>
        </div>
      </p>
    </>
  );
};

export default LoginButton;
