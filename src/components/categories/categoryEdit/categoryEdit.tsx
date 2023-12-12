import { Input } from "@nextui-org/react";
import { type Category } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, type FC, type FormEvent } from "react";
import { api } from "~/utils/api";
interface Props {
  category: Category;
}
const CategoryEdit: FC<Props> = (props: Props) => {
  const router = useRouter();
  const [name, setName] = useState(props.category.name);
  const [description, setDescription] = useState(props.category.description);
  const categoryEditMutation = api.categories.update.useMutation();
  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    categoryEditMutation.mutate(
      {
        id: props.category.id,
        name,
        description,
      },
      {
        onSuccess: () => {
          router.push(
            `/groups/${props.category.groupId}/categories/${props.category.id}`,
          );
        },
      },
    );
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
      <Input
        type="text"
        label="Description:"
        value={description}
        onValueChange={setDescription}
      />
      <Input type="submit" value="Submit" color="primary" />
    </form>
  );
};

export default CategoryEdit;
