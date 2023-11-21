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
import { type User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { type FC } from "react";

type Props = {
  rows: User[];
  loading: boolean;
};
export const TaskManageAssignments: FC<Props> = (props: Props) => {
  const router = useRouter();
  return (
    <Table
      onRowAction={(key) => router.push(`/users/${key}`)}
      isStriped
      selectionMode="single"
    >
      <TableHeader>
        <TableColumn>User</TableColumn>
        <TableColumn>{""}</TableColumn>
      </TableHeader>
      <TableBody
        items={props.rows}
        isLoading={props.loading}
        loadingContent={<Spinner label="Loading..." />}
        emptyContent={"We couldn't find anything"}
      >
        {(user) => (
          <TableRow>
            <TableCell>{user.name}</TableCell>
            <TableCell>
              <Button>Add</Button>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
