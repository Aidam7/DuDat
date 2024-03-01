import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { type User } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { type FC } from "react";
interface Props {
  user: User;
}
const UserActionPanel: FC<Props> = (props: Props) => {
  const { data: session } = useSession();
  const router = useRouter();
  if (!session) return null;
  const isSelf = session.user.id === props.user.id;
  if (!isSelf) return null;
  const actions = (
    <>
      <Button color="primary" onClick={() => void signOut()}>
        Sign out
      </Button>
      <Button
        color="warning"
        onClick={() => void router.push(`/users/${props.user.id}/settings`)}
      >
        Settings
      </Button>
    </>
  );
  return (
    <>
      <div className="ml-auto flex flex-row gap-2 max-lg:hidden">{actions}</div>
      <div className="ml-auto lg:hidden">
        <Popover>
          <PopoverTrigger>
            <Button>
              <span className="text-lg">Action Panel</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col gap-2">{actions}</div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

export default UserActionPanel;
