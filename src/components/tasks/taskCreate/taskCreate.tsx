import { Checkbox, Input } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, type FC, type FormEvent } from "react";
import { api } from "~/utils/api";
interface Props {
  groupId: string;
}
export const TaskCreate: FC<Props> = (props: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDueDate, setSelectedDueDate] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [isWish, setIsWish] = useState(false);
  const createTaskMutation = api.tasks.create.useMutation();
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    //*This is the only way I could find that prevents a redirect on the same page
    event.preventDefault();
    if (!session) return null;
    const dueDate = new Date(selectedDueDate);
    const startDate = new Date(selectedStartDate);
    await createTaskMutation.mutateAsync(
      {
        title: name,
        desc: description,
        parentGroupId: props.groupId,
        authorId: session.user.id,
        assigneeIDs: isWish ? [] : [session.user.id],
        dueOn: dueDate,
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
          value={name}
          onValueChange={setName}
        />
        <Input
          type="text"
          label="Description"
          value={description}
          onValueChange={setDescription}
        />
        <Input
          type="datetime-local"
          label="Start Date"
          value={selectedStartDate}
          onValueChange={setSelectedStartDate}
          labelPlacement="outside-left"
        />
        <Input
          type="datetime-local"
          label="Due Date"
          value={selectedDueDate}
          onValueChange={setSelectedDueDate}
          labelPlacement="outside-left"
        />
        <Checkbox isSelected={isWish} onValueChange={setIsWish}>
          Is a wish?
        </Checkbox>
        <Input type="submit" value="Submit" />
      </form>
    </>
  );
};
