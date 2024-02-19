import { type User } from "@prisma/client";
import React, { type FC } from "react";
import { formatDateToString } from "~/utils/func";

interface Props {
  user: User;
}

const UserDisplayStreak: FC<Props> = (props: Props) => {
  const startedStreak = props.user.startedStreak as Date | null;
  return (
    <div className="flex items-center justify-center">
      {startedStreak ? (
        <div className="rounded-full bg-green-500 px-4 py-2 text-white">
          Streak: {formatDateToString(startedStreak)}
        </div>
      ) : (
        <div className="rounded-full bg-gray-300 px-4 py-2 text-gray-600">
          No streak
        </div>
      )}
    </div>
  );
};

export default UserDisplayStreak;
