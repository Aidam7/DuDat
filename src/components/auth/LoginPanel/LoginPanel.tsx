import { Button, Image } from "@nextui-org/react";
import { signIn, signOut, useSession } from "next-auth/react";

const LoginButton: React.FC = () => {
  const { data: sessionData } = useSession();
  return (
    <div>
      <p>
        <div className="flex items-center">
          {sessionData?.user.image && (
            <Image
              src={sessionData.user.image}
              alt="Users avatar"
              width={32}
              height={32}
              className="mr-2 rounded-full"
            />
          )}
          {sessionData?.user.name && (
            <span className="pl-2.5 pr-5">
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
        </div>
      </p>
    </div>
  );
};

export default LoginButton;
