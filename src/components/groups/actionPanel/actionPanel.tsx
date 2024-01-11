import { Button } from "@nextui-org/react";
import { type Group } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, type FC } from "react";
import GroupLeave from "../groupLeave";
interface Props {
  group: Group;
}
const GroupActionPanel: FC<Props> = (props: Props) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [openActions, setOpenActions] = useState(false);
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
      <div className="ml-auto flex flex-row gap-2 max-sm:hidden">{actions}</div>
      <div className="ml-auto sm:hidden">
        <Button onClick={() => setOpenActions(!openActions)} className="mb-2">
          {openActions ? "▲ Close panel" : "▼ Open panel"}
        </Button>
      </div>
      {openActions && <div className="flex flex-col gap-2">{actions}</div>}
    </>
  );
};

export default GroupActionPanel;
