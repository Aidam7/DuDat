import {
  Button,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { type Category, type Task } from "@prisma/client";
import { useRouter } from "next/navigation";
import { type FC } from "react";
import { api } from "~/utils/api";
interface Props {
  task: Task;
  link: string;
}
interface CategoryWithAssigned extends Category {
  assigned: boolean;
}
const TaskManageCategories: FC<Props> = (props: Props) => {
  const { data: assignedCategories, isFetching: loadingCategories } =
    api.tasks.getCategories.useQuery({
      taskId: props.task.id,
    });
  const {
    data: unassignedCategories,
    isFetching: loadingUnassignedCategories,
  } = api.tasks.getUnassignedCategories.useQuery({ taskId: props.task.id });
  const addCategoryMutation = api.tasks.assignCategory.useMutation();
  const removeCategoryMutation = api.tasks.unassignCategory.useMutation();
  const router = useRouter();
  const utils = api.useUtils();
  const tableHeader = (
    <TableHeader>
      <TableColumn>Title</TableColumn>
      <TableColumn className="max-md:hidden">Description</TableColumn>
      <TableColumn>{""}</TableColumn>
    </TableHeader>
  );

  const combinedCategories: CategoryWithAssigned[] = [
    ...(assignedCategories ?? []).map((category) => ({
      ...category,
      assigned: true,
    })),
    ...(unassignedCategories ?? []).map((category) => ({
      ...category,
      assigned: false,
    })),
  ];

  const tableBody = (
    <TableBody
      items={combinedCategories}
      isLoading={loadingCategories || loadingUnassignedCategories}
      loadingContent={<Spinner label="Loading..." />}
      emptyContent={"We couldn't find anything"}
    >
      {(category) => (
        <TableRow>
          <TableCell>
            <span className="text-lg">{category.name}</span>{" "}
            {category.description !== "" && (
              <p className="md:hidden">
                <span className="font-semibold">Description:</span>{" "}
                {category.description}
              </p>
            )}
          </TableCell>
          <TableCell className="max-md:hidden">
            {category.description == "" ? "—" : category.description}
          </TableCell>
          <TableCell>
            {category.assigned ? (
              <Button
                color="danger"
                onClick={() => {
                  handleRemoveCategory(category.id, props.task.id);
                }}
              >
                Remove
              </Button>
            ) : (
              <Button
                color="primary"
                onClick={() => {
                  handleAddCategory(category.id, props.task.id);
                }}
              >
                Assign
              </Button>
            )}
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
  function handleAddCategory(categoryId: string, taskId: string) {
    return addCategoryMutation.mutate(
      { taskId, categoryId },
      {
        onSuccess: () => {
          void utils.tasks.getCategories.invalidate();
          void utils.tasks.getUnassignedCategories.invalidate();
        },
      },
    );
  }
  function handleRemoveCategory(categoryId: string, taskId: string) {
    return removeCategoryMutation.mutate(
      { taskId, categoryId },
      {
        onSuccess: () => {
          void utils.tasks.getCategories.invalidate();
          void utils.tasks.getUnassignedCategories.invalidate();
        },
      },
    );
  }
  return (
    <Table
      onRowAction={(key) => router.push(`${props.link}${key}`)}
      isStriped
      selectionMode="single"
    >
      {tableHeader}
      {tableBody}
    </Table>
  );
};

export default TaskManageCategories;
