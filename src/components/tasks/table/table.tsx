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
  renderFinishedOn?: boolean;
  link?: string;
};

export const TaskTable: FC<Props> = (props: Props) => {
  const router = useRouter();
  const tableHeader = (
    <TableHeader>
      <TableColumn>
        <div className="max-md:hidden">Title</div>
        <div className="md:hidden">Task</div>
      </TableColumn>
      <TableColumn className="max-md:hidden">Description</TableColumn>
      <TableColumn className="max-md:hidden">Due Date</TableColumn>
      <TableColumn className={props.renderFinishedOn ? "" : "hidden"}>
        Finished On
      </TableColumn>
      <TableColumn
        className={`${props.doNotRenderGroup ? "hidden" : ""} max-md:hidden`}
      >
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
          <TableCell>
            {props.link ? (
              <span className="text-lg">{task.title}</span>
            ) : (
              <Link
                href={`groups/${task.groupId}/tasks/${task.id}`}
                className="paren group-hover:underline"
              >
                <span className="text-lg">{task.title}</span>
              </Link>
            )}
            {task.description !== "" && (
              <p className="md:hidden">
                <span className="font-semibold">Description:</span>{" "}
                {task.description}
              </p>
            )}
            {task.dueOn !== null && (
              <p className="md:hidden">
                <span className="font-semibold">Due on:</span>{" "}
                {task.dueOn.toLocaleDateString()}
              </p>
            )}
          </TableCell>

          <TableCell className="max-md:hidden">
            {task.description !== "" ? task.description : "—"}
          </TableCell>
          <TableCell className="max-md:hidden">
            {task.dueOn !== null ? task.dueOn.toLocaleDateString() : "—"}
          </TableCell>
          <TableCell className={props.renderFinishedOn ? "" : "hidden"}>
            {task.finishedOn !== null
              ? task.finishedOn.toLocaleDateString()
              : "—"}
          </TableCell>
          <TableCell
            className={`${
              props.doNotRenderGroup ? "hidden" : ""
            } max-md:hidden`}
          >
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
