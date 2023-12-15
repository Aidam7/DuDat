import { Chip, Spinner } from "@nextui-org/react";
import { type Category } from "@prisma/client";
import Link from "next/link";
import { type FC } from "react";
interface Props {
  categories: Category[] | undefined;
  loading?: boolean;
}
const CategoryChipDisplay: FC<Props> = (props: Props) => {
  if (props.loading) return <Spinner label="Loading..." />;
  if (!props.categories) return null;
  return (
    <>
      {props.categories.map((category) => (
        <Link
          key={category.id}
          href={`/groups/${category.groupId}/categories/${category.id}`}
        >
          <Chip variant="dot">{category.name}</Chip>
        </Link>
      ))}
    </>
  );
};

export default CategoryChipDisplay;
