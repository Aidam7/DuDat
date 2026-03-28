export interface TaskState {
  finishedOn: Date | null;
  confirmedAsFinished: boolean;
}

export const splitTasksByState = <T extends TaskState>(
  tasks: T[] | null | undefined,
) => {
  const safeTasks = tasks ?? [];
  const finished = safeTasks.filter(
    (task) => task.finishedOn != null && task.confirmedAsFinished === true,
  );
  const ongoing = safeTasks.filter((task) => task.finishedOn == null);

  return {
    finished,
    ongoing,
  };
};