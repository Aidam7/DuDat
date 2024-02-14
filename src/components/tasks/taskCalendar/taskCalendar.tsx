import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useCallback, type FC } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import {
  roundToNextHour,
  roundToPreviousHour,
  roundToZero,
} from "~/utils/func";
import { type ITaskWithGroup } from "~/utils/types";
interface Props {
  tasks: ITaskWithGroup[] | undefined | null;
}
const TaskCalendar: FC<Props> = (props: Props) => {
  const tasks = props.tasks ?? [];
  const events = tasks.map((task) => ({
    start: new Date(
      task.startOn
        ? task.startOn
        : task.dueOn
          ? roundToPreviousHour(task.dueOn)
          : roundToZero(task.createdOn),
    ),
    end: new Date(
      task.dueOn
        ? task.dueOn
        : task.startOn
          ? roundToNextHour(task.startOn)
          : roundToZero(task.createdOn),
    ),
    title: `${task.title} — ${task.group.name}`,
    taskId: task.id,
    groupId: task.groupId,
    finished: task.finishedOn != null,
  }));
  const router = useRouter();
  const localizer = dayjsLocalizer(dayjs);
  const onSelectEvent = useCallback(
    (task: { taskId: string; groupId: string }) => {
      router.push(`/groups/${task.groupId}/tasks/${task.taskId}`);
    },
    [router],
  );
  const eventStyleGetter = (event: { finished: boolean; end: Date }) => {
    let backgroundColor = "#3174ad";
    if (event.finished) {
      backgroundColor = "#3f7806";
    }
    if (
      event.end < new Date() &&
      !event.finished &&
      event.end.getHours() !== 0 &&
      event.end.getMinutes() !== 0
    ) {
      backgroundColor = "#ad3131";
    }
    const style = {
      backgroundColor: backgroundColor,
      color: "#ffffff",
    };
    return {
      style: style,
    };
  };
  return (
    <Calendar
      localizer={localizer}
      startAccessor="start"
      endAccessor="end"
      events={events}
      className="min-h-[600px] w-full bg-white text-black"
      onSelectEvent={onSelectEvent}
      eventPropGetter={eventStyleGetter}
    />
  );
};

export default TaskCalendar;
