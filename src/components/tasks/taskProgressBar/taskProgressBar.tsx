import { Progress } from "@nextui-org/react";
import { type Task } from "@prisma/client";
import React from "react";
import { formatDateToString } from "~/utils/func";

interface Props {
  task: Task;
}

const TaskProgressBar: React.FC<Props> = (props: Props) => {
  if (props.task.dueOn == null || props.task.startOn == null) return null;
  const isLate = props.task.dueOn < new Date();
  const isNearingEnd =
    props.task.dueOn.getTime() - Date.now() < 24 * 60 * 60 * 1000;
  const timeBetween = props.task.dueOn.getTime() - props.task.startOn.getTime();
  const timeSinceStart = Date.now() - props.task.startOn.getTime();
  const color = isLate ? "danger" : isNearingEnd ? "warning" : "primary";

  return (
    <div>
      <Progress
        maxValue={timeBetween}
        value={timeSinceStart}
        color={color}
        size="lg"
        isStriped={props.task.confirmedAsFinished}
      />
      <div className="flex flex-row justify-between font-semibold">
        <p>{formatDateToString(props.task.startOn)}</p>
        <p>{formatDateToString(props.task.dueOn)}</p>
      </div>
    </div>
  );
};

export default TaskProgressBar;
