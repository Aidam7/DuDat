import { Button, Image } from "@nextui-org/react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const LoginButton: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex items-center break-words">
      <Link
        href={`/users/${sessionData?.user.id}`}
        className="flex items-center break-words"
      >
        {sessionData?.user.image && (
          <Image
            src={sessionData.user.image}
            alt={`${sessionData.user.name}'s avatar`}
            className="m-1 rounded-full"
            height={48}
            width={48}
          />
        )}
      </Link>
      {!sessionData && (
        <Button color="primary" onClick={() => void signIn()}>
          Sign in
        </Button>
      )}
    </div>
  );
};

export default LoginButton;
