import { Input } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { type FC, useState, type FormEvent } from "react";
import { api } from "~/utils/api";

export const GroupCreate: FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const createGroupMutation = api.groups.create.useMutation();
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    //*This is the only way I could find that prevents a redirect on the same page
    event.preventDefault();
    if (!session) return null;
    const group = await createGroupMutation.mutateAsync({
      name,
      description,
      memberIDs: [session.user.id],
      ownerId: session.user.id,
    });
    router.push(`/groups/${group.id}`);
  };

  return (
    <>
      <form
        className="flex flex-col items-center justify-center"
        onSubmit={handleSubmit}
      >
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
