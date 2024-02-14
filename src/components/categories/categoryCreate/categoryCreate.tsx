import { Button, Input } from "@nextui-org/react";
import { useRouter as useNav } from "next/navigation";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { api } from "~/utils/api";

const CategoryCreate: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();
  const nav = useNav();
  const groupId = router.query.groupId as string;
  const createTaskMutation = api.categories.create.useMutation();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    createTaskMutation.mutate(
      { groupId, name, description },
      {
        onSuccess(category) {
          nav.push(`/groups/${groupId}/categories/${category.id}`);
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="items-left justify-left flex flex-col gap-5"
    >
      <Input
        type="text"
        value={name}
        onValueChange={setName}
        label="Name:"
        isRequired
      />
      <Input
        type="text"
        value={description}
        onValueChange={setDescription}
        label="Description:"
      />
      <Button type="submit">Create</Button>
    </form>
  );
};

export default CategoryCreate;
