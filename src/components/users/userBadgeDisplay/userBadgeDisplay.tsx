import { type User } from "@prisma/client";
import { type FC } from "react";
import { getUserTaskBadge } from "~/utils/userBadge";

interface Props {
  user: User;
}

const UserBadgeDisplay: FC<Props> = (props: Props) => {
  const badge = getUserTaskBadge(props.user);
  if (!badge) return null;

  return <span className="text-xl font-semibold">{badge}</span>;
};
export default UserBadgeDisplay;
