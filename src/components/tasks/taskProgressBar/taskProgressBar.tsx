import { Progress } from "@nextui-org/react";
import { type Task } from "@prisma/client";
import React from "react";

interface Props {
  task: Task;
}

const TaskProgressBar: React.FC<Props> = (props: Props) => {
  if (props.task.dueOn == null || props.task.startOn == null) return null;
  const timeBetweenStartAndDue =
    props.task.dueOn.getTime() - props.task.startOn.getTime();
  const timeBetweenTodayAndDue =
    props.task.dueOn.getTime() - new Date().getTime();
  const value = timeBetweenTodayAndDue < 0 ? 1 : timeBetweenTodayAndDue;
  const progressValue =
    props.task.startOn.getTime() > new Date().getTime() ? 0 : value;
  const isDueAfterToday = props.task.dueOn.getTime() < new Date().getTime();

  return (
    <>
      <Progress
        label="POMOC"
        maxValue={timeBetweenStartAndDue}
        value={progressValue}
        showValueLabel
        color={isDueAfterToday ? "primary" : "danger"}
      />
    </>
  );
};

export default TaskProgressBar;
