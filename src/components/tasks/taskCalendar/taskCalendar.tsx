import { type Task } from "@prisma/client";
import dayjs from "dayjs";
import { type FC } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
interface Props {
  tasks: Task[];
}
const TaskCalendar: FC<Props> = (props: Props) => {
  const events = props.tasks
    .filter((task) => task.dueOn !== null)
    .map((task) => ({
      start: new Date(task.startOn ? task.startOn : task.createdOn),
      end: new Date(task.dueOn ? task.dueOn : task.createdOn),
      title: task.title,
    }));

  const localizer = dayjsLocalizer(dayjs);
  return (
    <div className="flex flex-col items-center rounded-xl bg-white">
      <Calendar
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        events={events}
        className="min-h-[600px] w-[97.5%] bg-white text-black max-md:w-[90%]"
      />
    </div>
  );
};

export default TaskCalendar;
