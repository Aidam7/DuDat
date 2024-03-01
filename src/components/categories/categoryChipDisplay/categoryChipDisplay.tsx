import { Chip } from "@nextui-org/react";
import { type Category } from "@prisma/client";
import Link from "next/link";
import { type FC } from "react";
interface Props {
  categories: Category[] | undefined | null;
  loading?: boolean;
  displayHeader?: boolean;
  displayWrapper?: boolean;
}
const CategoryChipDisplay: FC<Props> = (props: Props) => {
  if (!props.categories || props.categories.length == 0) return null;
  return (
    <>
      {props.displayHeader && <h2 className="pb-5 text-4xl">Categories</h2>}
      <div
        className={`flex flex-wrap gap-4 overflow-auto ${
          props.displayWrapper && "rounded-2xl bg-content1 p-4 shadow-small"
        }`}
      >
        {props.categories.map((category) => (
          <Link
            key={category.id}
            href={`/groups/${category.groupId}/categories/${category.id}`}
          >
            <Chip variant="dot">{category.name}</Chip>
          </Link>
        ))}
      </div>
    </>
  );
};

export default CategoryChipDisplay;
