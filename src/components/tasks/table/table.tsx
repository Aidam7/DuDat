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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FC } from "react";
import { type ITaskWithGroup } from "~/utils/types";

type Props = {
  rows: ITaskWithGroup[];
  loading: boolean;
};
export const TaskTable: FC<Props> = (props: Props) => {
  const router = useRouter();
  return (
    <Table
      onRowAction={(key) => router.push(`/tasks/${key}`)}
      isStriped
      selectionMode="single"
    >
      <TableHeader>
        <TableColumn>Title</TableColumn>
        <TableColumn>Description</TableColumn>
        <TableColumn>Due Date</TableColumn>
        <TableColumn>Group</TableColumn>
        <TableColumn>{""}</TableColumn>
      </TableHeader>
      <TableBody
        items={props.rows}
        isLoading={props.loading}
        loadingContent={<Spinner label="Loading..." />}
        emptyContent={"We couldn't find anything"}
      >
        {(task) => (
          <TableRow>
            <TableCell>{task.title}</TableCell>
            <TableCell>
              {task.description != "" ? task.description : "—"}
            </TableCell>
            <TableCell>
              {task.dueOn != null ? task.dueOn.toLocaleDateString() : "—"}
            </TableCell>
            <TableCell>
              <Link href={`/groups/${task.groupId}`}>{task.group.name}</Link>
            </TableCell>
            <TableCell>
              <Button>Assign myself</Button>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
