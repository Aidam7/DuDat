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
  tasks: ITaskWithGroup[];
}
const TaskCalendar: FC<Props> = (props: Props) => {
  const events = props.tasks.map((task) => ({
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
    const endIsZero = event.end == roundToZero(new Date());
    if (event.finished && !endIsZero) {
      backgroundColor = "#3f7806";
    }
    if (event.end < new Date() && !event.finished) {
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
    <div className="flex flex-col items-center rounded-xl bg-white p-5">
      <Calendar
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        events={events}
        className="min-h-[600px] w-full bg-white text-black"
        onSelectEvent={onSelectEvent}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
};

export default TaskCalendar;
