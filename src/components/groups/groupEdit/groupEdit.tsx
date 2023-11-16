import { Input } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FC, type FormEvent } from "react";
import Code404 from "~/components/layout/errorCodes/404";
import { api } from "~/utils/api";
interface Props {
  groupId: string;
}
export const GroupEdit: FC<Props> = (props: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const editGroupMutation = api.groups.edit.useMutation();
  const { data: session } = useSession();
  const router = useRouter();
  const { data: group } = api.groups.getById.useQuery(
    { id: props.groupId },
    { enabled: session !== null },
  );
  useEffect(() => {
    if (group) {
      setName(group.name);
      setDescription(group.description);
    }
  }, [group]);
  if (!group) return <Code404 />;
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    //*This is the only way I could find that prevents a redirect on the same page
    event.preventDefault();
    if (!session) return null;
    await editGroupMutation.mutateAsync(
      {
        name,
        description,
        ownerId: session.user.id,
        groupId: group.id,
      },
      { onSuccess: () => router.push(`/groups/${group.id}`) },
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
