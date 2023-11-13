import { Input } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { type FC, useState, type FormEvent } from "react";
import { api } from "~/utils/api";
interface Props {
  groupId: string;
}
export const TaskCreate: FC<Props> = (props: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const createTaskMutation = api.tasks.create.useMutation();
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    //*This is the only way I could find that prevents a redirect on the same page
    event.preventDefault();
    if (!session) return null;
    const task = await createTaskMutation.mutateAsync({
      title: name,
      desc: description,
      parentGroupId: props.groupId,
      authorId: session.user.id,
      assigneeIDs: [session.user.id],
      dueOn: null,
    });
    router.push(`/tasks/${task.id}`);
  };

  return (
    <>
      <form
        className="flex flex-col items-center justify-center"
        onSubmit={handleSubmit}
      >
        <h3 className="mb-4 text-3xl font-bold">Create a task</h3>
        <Input
          type="text"
          label="Task Title"
          isRequired
          value={name}
          onValueChange={setName}
          className="mb-4"
        />
        <Input
          type="text"
          label="Description"
          value={description}
          onValueChange={setDescription}
          className="mb-4"
        />

        <input type="submit" value="Submit" />
      </form>
    </>
  );
};
