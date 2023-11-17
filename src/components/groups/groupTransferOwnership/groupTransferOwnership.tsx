import {
  Button,
  Image,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React from "react";
import { api } from "~/utils/api";
import { type ITableColumns } from "~/utils/types";

const columns: ITableColumns[] = [
  { label: "User", key: "name" },
  { label: "", key: "actions" },
];

const GroupTransferOwnership: React.FC = () => {
  const findUsersQuery = api.users.locateByName;
  const { data: users } = findUsersQuery.useQuery({ name: "", groupId: "" });
  if (!users) return null;
  return (
    <Table isStriped>
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={users}>
        {(user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center justify-start space-x-5">
                <Image
                  className="mr-2 rounded-lg max-md:hidden"
                  height={64}
                  width={64}
                  src={user.image ? user.image : ""}
                  alt={`${user.name}'s avatar`}
                />
                <span>{user.name}</span>
              </div>
            </TableCell>
            <TableCell align="right">
              <Button color="danger">Transfer Ownership</Button>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
export default GroupTransferOwnership;
