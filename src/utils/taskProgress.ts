export type TaskProgressColor = "danger" | "warning" | "success" | "primary";

export interface TaskProgressState {
  dueOn: Date | null;
  startOn: Date | null;
  finishedOn: Date | null;
  confirmedAsFinished: boolean;
}

export const getTaskProgressColor = (
  task: TaskProgressState,
  now = new Date(),
): TaskProgressColor | null => {
  if (task.dueOn == null || task.startOn == null) return null;

  const isLate = task.dueOn < now && !task.finishedOn;
  const wasLate = task.finishedOn != null && task.dueOn < task.finishedOn;
  const timeToComplete = task.dueOn.getTime() - task.startOn.getTime();
  const timeSinceStart = now.getTime() - task.startOn.getTime();
  const isNearingEnd = timeSinceStart > timeToComplete * 0.8;

  if (isLate || wasLate) return "danger";
  if (isNearingEnd) return "warning";
  if (task.confirmedAsFinished) return "success";
  return "primary";
};