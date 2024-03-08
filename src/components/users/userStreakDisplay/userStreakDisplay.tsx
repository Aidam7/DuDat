import { type User } from "@prisma/client";
import React, { type FC } from "react";

interface Props {
  user: User;
}

const UserDisplayStreak: FC<Props> = (props: Props) => {
  const startedStreak = props.user.startedStreak;
  if (!startedStreak)
    return (
      <div className="w-fit">
        <div className="rounded-full bg-gray-300 px-4 py-2 text-gray-600">
          No streak
        </div>
      </div>
    );
  const today = new Date();
  const daysSinceStreak = today.getDay() - startedStreak.getDay();
  return (
    <div className="w-fit">
      <div className="rounded-full bg-green-500 px-4 py-2 text-white">
        Streak:{" "}
        {daysSinceStreak == 0 ? "Started today" : daysSinceStreak + " days"}
      </div>
    </div>
  );
};

export default UserDisplayStreak;
