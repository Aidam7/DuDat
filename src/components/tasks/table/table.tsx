import React, { type FC } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Spinner,
} from "@nextui-org/react";
import Link from "next/link";
import { type ITaskWithGroup, type ITableColumns } from "~/utils/types";

type Props = {
  columns: ITableColumns[];
  rows: ITaskWithGroup[];
  loading: boolean;
};
export const TaskTable: FC<Props> = (props: Props) => {
  console.table(props.rows)
  return (
    <Table>
      <TableHeader columns={props.columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody
        items={props.rows}
        isLoading={props.loading}
        loadingContent={<Spinner label="Loading..." />}
        emptyContent={"We couldn't find anything"}
      >
        {(item) => (
          <TableRow>
            {(columnKey) => (
              <TableCell>
                <Link href={`/tasks/${item.id}`}>
                  {getKeyValue(item, columnKey) == null ? "—" : getKeyValue(item, columnKey)}
                </Link>
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
