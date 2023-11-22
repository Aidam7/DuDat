import {
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
  doNotRenderGroup?: boolean;
  link?: string;
};

export const TaskTable: FC<Props> = (props: Props) => {
  const router = useRouter();
  const tableHeader = (
    <TableHeader>
      <TableColumn>Title</TableColumn>
      <TableColumn>Description</TableColumn>
      <TableColumn>Due Date</TableColumn>
      <TableColumn className={props.doNotRenderGroup ? "hidden" : ""}>
        Group
      </TableColumn>
    </TableHeader>
  );

  const tableBody = (
    <TableBody
      items={props.rows}
      isLoading={props.loading}
      loadingContent={<Spinner label="Loading..." />}
      emptyContent={"We couldn't find anything"}
    >
      {(task) => (
        <TableRow className="group">
          {props.link ? (
            <TableCell>{task.title}</TableCell>
          ) : (
            <TableCell>
              <Link
                href={`groups/${task.groupId}/tasks/${task.id}`}
                className="paren group-hover:underline"
              >
                {task.title}
              </Link>
            </TableCell>
          )}

          <TableCell>
            {task.description !== "" ? task.description : "—"}
          </TableCell>
          <TableCell>
            {task.dueOn !== null ? task.dueOn.toLocaleDateString() : "—"}
          </TableCell>
          <TableCell className={props.doNotRenderGroup ? "hidden" : ""}>
            <Link href={`/groups/${task.groupId}`}>{task.group.name}</Link>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );

  return (
    <>
      {props.link ? (
        <Table
          isStriped
          selectionMode="single"
          onRowAction={(key) => router.push(`${props.link}${key}`)}
        >
          {tableHeader}
          {tableBody}
        </Table>
      ) : (
        <Table isStriped selectionMode="single">
          {tableHeader}
          {tableBody}
        </Table>
      )}
    </>
  );
};
