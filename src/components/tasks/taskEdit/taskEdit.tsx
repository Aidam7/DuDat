import { Input } from "@nextui-org/react";
import { type Task } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, type FC, type FormEvent } from "react";
import { api } from "~/utils/api";
interface Props {
  task: Task;
}
export const TaskEdit: FC<Props> = (props: Props) => {
  const [title, setTitle] = useState(props.task.title);
  const [description, setDescription] = useState(props.task.description);
  // const [selectedDate, setSelectedDate] = useState(
  //   props.task.dueOn
  //     ? `${props.task.dueOn.getUTCFullYear()}-${props.task.dueOn.getUTCMonth()}-${props.task.dueOn.getUTCDay()}T${props.task.dueOn.getUTCHours()}:${props.task.dueOn.getUTCMinutes()}`
  //     : "",
  // );
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
        dueOn: props.task.dueOn,
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
        {/* <Input
          type="datetime-local"
          label="Due Date"
          value={selectedDate}
          onValueChange={setSelectedDate}
          labelPlacement="outside-left"
        /> */}
        <Input type="submit" value="Submit" />
      </form>
    </>
  );
};
