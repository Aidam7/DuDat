import { Input } from "@nextui-org/react";
import { type Task } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, type FC, type FormEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { api } from "~/utils/api";
interface Props {
  task: Task;
}
export const TaskEdit: FC<Props> = (props: Props) => {
  const [title, setTitle] = useState(props.task.title);
  const [description, setDescription] = useState(props.task.description);
  const [endDate, setEndDate] = useState(props.task.dueOn);
  const [startDate, setStartDate] = useState(props.task.startOn);
  const { data: session } = useSession();
  const editTaskMutation = api.tasks.edit.useMutation();
  const router = useRouter();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    //*This is the only way I could find that prevents a redirect on the same page
    event.preventDefault();
    if (!session) return null;
    // const dueDate = new Date(selectedDate);
    await editTaskMutation.mutateAsync(
      {
        id: props.task.id,
        title: title,
        desc: description,
        dueOn: endDate,
        startOn: startDate,
      },
      {
        onSuccess(task) {
          router.push(`/groups/${task.groupId}/tasks/${task.id}`);
        },
      },
    );
  };
  return (
    <>
      <form
        className="items-left justify-left flex flex-col gap-5"
        onSubmit={handleSubmit}
      >
        <h3 className="mb-4 text-3xl font-bold">Create a task</h3>
        <Input
          type="text"
          label="Task Title"
          isRequired
          value={title}
          onValueChange={setTitle}
        />
        <Input
          type="text"
          label="Description"
          value={description}
          onValueChange={setDescription}
        />
        <div>
          <label>Start On</label>
          <br />
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date ?? new Date())}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            showTimeSelect
            timeFormat="p"
            dateFormat="Pp"
          />
          <br />
          <label>Due On</label>
          <br />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date ?? new Date())}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            showTimeSelect
            timeFormat="p"
            dateFormat="Pp"
          />
        </div>
        <Input type="submit" value="Submit" />
      </form>
    </>
  );
};
