import {
  Image,
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
  rows: User[] | null | undefined;
  loading: boolean;
};
export const UserTable: FC<Props> = (props: Props) => {
  const router = useRouter();
  const tableBody = (
    <TableBody
      items={props.rows ? props.rows : []}
      isLoading={props.loading}
      loadingContent={<Spinner label="Loading..." />}
      emptyContent={"We couldn't find anyone."}
    >
      {(user) => (
        <TableRow>
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
        </TableRow>
      )}
    </TableBody>
  );
  return (
    <>
      <Table
        isStriped
        selectionMode="single"
        onRowAction={(key) => router.push(`/users/${key}`)}
      >
        <TableHeader>
          <TableColumn>User</TableColumn>
        </TableHeader>
        {tableBody}
      </Table>
    </>
  );
};
