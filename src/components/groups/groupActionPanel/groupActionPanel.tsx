import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { type Group } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { type FC } from "react";
import GroupLeave from "../groupLeave";
interface Props {
  group: Group;
}
const GroupActionPanel: FC<Props> = (props: Props) => {
  const router = useRouter();
  const { data: session } = useSession();
  if (!session) return null;
  const groupId = props.group.id;
  const isOwner = props.group.ownerId == session.user.id;
  const actions = (
    <>
      <Button
        color="primary"
        onClick={() => router.push(`/groups/${groupId}/tasks/create`)}
      >
        Create a new task
      </Button>
      <Button
        color="primary"
        onClick={() => router.push(`/groups/${groupId}/categories/create`)}
      >
        Create a new category
      </Button>
      {isOwner ? (
        <Button color="warning" onClick={() => router.push(`${groupId}/admin`)}>
          Settings
        </Button>
      ) : (
        <GroupLeave groupId={groupId} />
      )}
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

export default GroupActionPanel;
