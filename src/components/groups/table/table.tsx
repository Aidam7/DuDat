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
import { type Group } from "@prisma/client";
import Link from "next/link";
import { type ITableColumns } from "~/utils/types";
import { useRouter } from "next/navigation";

type Props = {
  columns: ITableColumns[];
  rows: Group[];
  loading: boolean;
};
export const GroupTable: FC<Props> = (props: Props) => {
  const router = useRouter();
  return (
    <Table
      onRowAction={(key) => router.push(`/groups/${key}`)}
      isStriped
      selectionMode="single"
    >
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
                {getKeyValue(item, columnKey) == null ||
                getKeyValue(item, columnKey) == ""
                  ? "—"
                  : getKeyValue(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
