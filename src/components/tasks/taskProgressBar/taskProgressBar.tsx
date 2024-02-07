import { Progress } from "@nextui-org/react";
import { type Task } from "@prisma/client";
import React from "react";
import { formatDateToString } from "~/utils/func";

interface Props {
  task: Task;
}

const TaskProgressBar: React.FC<Props> = (props: Props) => {
  if (props.task.dueOn == null || props.task.startOn == null) return null;
  const isLate = props.task.dueOn < new Date() && !props.task.finishedOn;
  const wasLate =
    props.task.finishedOn && props.task.dueOn < props.task.finishedOn;
  const isNearingEnd =
    props.task.dueOn.getTime() - Date.now() < 24 * 60 * 60 * 1000 &&
    !props.task.finishedOn;
  const timeBetween = props.task.dueOn.getTime() - props.task.startOn.getTime();
  const timeSinceStart = Date.now() - props.task.startOn.getTime();
  const color =
    isLate || wasLate
      ? "danger"
      : isNearingEnd
        ? "warning"
        : props.task.confirmedAsFinished
          ? "success"
          : "primary";
  const value = props.task.finishedOn
    ? props.task.finishedOn.getTime() - props.task.startOn.getTime()
    : timeSinceStart;

  return (
    <div>
      <div className="flex justify-center">
        {props.task.finishedOn && (
          <p className="content-end text-xl font-semibold">
            Finished on: {formatDateToString(props.task.finishedOn)}
          </p>
        )}
      </div>
      <Progress
        maxValue={timeBetween}
        value={value}
        color={color}
        size="lg"
        isStriped={props.task.confirmedAsFinished}
        radius="sm"
      />
      <div className="flex flex-row justify-between font-semibold">
        <p>{formatDateToString(props.task.startOn)}</p>
        <p>{formatDateToString(props.task.dueOn)}</p>
      </div>
    </div>
  );
};

export default TaskProgressBar;
