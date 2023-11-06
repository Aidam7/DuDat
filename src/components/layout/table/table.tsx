import React, { type FC } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/react";
import { type Group } from "@prisma/client";

interface IColums {
  key: string;
  label: string;
}
type Props = {
  columns: IColums[];
  rows: Group[];
};
export const GroupTable: FC<Props> = (props: Props) => {
  return (
    <Table>
      <TableHeader columns={props.columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={props.rows}>
        {(item) => (
          <TableRow>
            {(columnKey) => (
              <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
