import { Input } from "@nextui-org/react";
import { type Group } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, type FC, type FormEvent } from "react";
import { api } from "~/utils/api";
interface Props {
  group: Group;
}
export const GroupEdit: FC<Props> = (props: Props) => {
  const [name, setName] = useState(props.group.name);
  const [description, setDescription] = useState(props.group.description);
  const editGroupMutation = api.groups.edit.useMutation();
  const { data: session } = useSession();
  const router = useRouter();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    //*This is the only way I could find that prevents a redirect on the same page
    event.preventDefault();
    if (!session) return null;
    await editGroupMutation.mutateAsync(
      {
        name,
        description,
        ownerId: session.user.id,
        groupId: props.group.id,
      },
      { onSuccess: () => router.push(`/groups/${props.group.id}`) },
    );
  };

  return (
    <>
      <form
        className="flex flex-col items-center justify-center"
        onSubmit={handleSubmit}
      >
        <h3 className="mb-4 text-3xl font-bold">Edit this group</h3>
        <Input
          type="text"
          label="Group name"
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
        <Input type="submit" value="Submit" color="primary" />
      </form>
    </>
  );
};
