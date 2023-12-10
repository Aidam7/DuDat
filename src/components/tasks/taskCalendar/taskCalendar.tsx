import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useCallback, type FC } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import { type ITaskWithGroup } from "~/utils/types";
interface Props {
  tasks: ITaskWithGroup[];
}
const TaskCalendar: FC<Props> = (props: Props) => {
  const events = props.tasks.map((task) => ({
    start: new Date(
      task.startOn ? task.startOn : task.dueOn ? task.dueOn : task.createdOn,
    ),
    end: new Date(
      task.dueOn ? task.dueOn : task.startOn ? task.startOn : task.createdOn,
    ),
    title: `${task.title} — ${task.group.name}`,
    taskId: task.id,
    groupId: task.groupId,
  }));
  const router = useRouter();
  const localizer = dayjsLocalizer(dayjs);
  const onSelectEvent = useCallback(
    (task: { taskId: string; groupId: string }) => {
      router.push(`/groups/${task.groupId}/tasks/${task.taskId}`);
    },
    [router],
  );
  return (
    <div className="flex flex-col items-center rounded-xl bg-white">
      <Calendar
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        events={events}
        className="min-h-[600px] w-[97.5%] bg-white text-black max-md:w-[90%]"
        onSelectEvent={onSelectEvent}
      />
    </div>
  );
};

export default TaskCalendar;
