import { type User } from "@prisma/client";
import { type FC } from "react";

interface Props {
  user: User;
}

const UserBadgeDisplay: FC<Props> = (props: Props) => {
  const percentage =
    Math.floor(
      (props.user.finishedTasksLateCount /
        (props.user.finishedTasksCount + props.user.finishedTasksLateCount)) *
        10,
    ) * 10;
  let badge = "";
  if (isNaN(percentage)) return null;
  if (percentage == 0) badge = "🤩 Finished all tasks on time";
  else if (percentage < 25) badge = "🥳 Finished almost all tasks on time";
  else if (percentage < 50) badge = "👌 Finished most tasks on time";
  else if (percentage < 100)
    badge = "👍 Could do better at finishing tasks on time";
  else badge = "😞 Finished no tasks on time";

  return <span className="text-xl font-semibold">{badge}</span>;
};
export default UserBadgeDisplay;
