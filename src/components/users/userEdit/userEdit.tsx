import { Input } from "@nextui-org/react";
import { type User } from "@prisma/client";
import React, { useState, type FC } from "react";
import { api } from "~/utils/api";

interface Props {
  user: User;
}

const UserEdit: FC<Props> = (props: Props) => {
  const [name, setName] = useState(props.user.name);
  const userEditMutation = api.users.editName.useMutation();
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    userEditMutation.mutate({ userId: props.user.id, newName: name });
  }
  return (
    <form
      className="flex flex-col items-center justify-center gap-5"
      onSubmit={handleSubmit}
    >
      <Input
        type="text"
        label="Name:"
        value={name}
        onValueChange={setName}
        isRequired
      />
      <Input type="submit" value="Submit" color="primary" />
    </form>
  );
};

export default UserEdit;
