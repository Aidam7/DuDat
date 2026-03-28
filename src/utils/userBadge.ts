export interface UserTaskStats {
  finishedTasksCount: number;
  finishedTasksLateCount: number;
}

export const getUserTaskBadge = (stats: UserTaskStats) => {
  const percentage =
    Math.floor(
      (stats.finishedTasksLateCount /
        (stats.finishedTasksCount + stats.finishedTasksLateCount)) *
      10,
    ) * 10;

  if (isNaN(percentage)) return null;
  if (percentage === 0) return "🤩 Finished all tasks on time";
  if (percentage < 25) return "🥳 Finished almost all tasks on time";
  if (percentage < 50) return "👌 Finished most tasks on time";
  if (percentage < 100) return "👍 Could do better at finishing tasks on time";
  return "😞 Finished no tasks on time";
};