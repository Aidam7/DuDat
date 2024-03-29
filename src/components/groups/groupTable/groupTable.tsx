import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { type Group } from "@prisma/client";
import { useRouter } from "next/navigation";
import { type FC } from "react";

type Props = {
  rows: Group[] | null | undefined;
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
      <TableHeader>
        <TableColumn>Name</TableColumn>
        <TableColumn>Description</TableColumn>
      </TableHeader>
      <TableBody
        items={props.rows ? props.rows : []}
        isLoading={props.loading}
        loadingContent={<Spinner label="Loading..." />}
        emptyContent={"We couldn't find anything"}
      >
        {(group) => (
          <TableRow>
            <TableCell>{group.name != "" ? group.name : "—"}</TableCell>
            <TableCell>
              {group.description != "" ? group.description : "—"}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
