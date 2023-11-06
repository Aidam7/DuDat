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

type Props = {
  columns: ITableColumns[];
  rows: Group[];
  loading: boolean;
};
export const GroupTable: FC<Props> = (props: Props) => {
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
                <Link href={`/groups/${item.id}`}>
                  {getKeyValue(item, columnKey)}
                </Link>
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
