import { Input } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { type FC, useState } from "react";
import { api } from "~/utils/api";

export const GroupCreate: FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const createGroupMutation = api.groups.create.useMutation();
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!session) return null;
    await createGroupMutation.mutateAsync({
      name,
      description,
      memberIDs: [session.user.id],
      ownerId: session.user.id,
    });
    //TODO: For some reason the page refreshes after submit, so this never gets called
    router.push("/groups");
  };

  return (
    <>
      <form
        className="flex flex-col items-center justify-center"
        onSubmit={handleSubmit}
      >
        <h3 className="mb-4 text-3xl font-bold">Create a group</h3>
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

        <input type="submit" value="Submit" />
      </form>
    </>
  );
};
