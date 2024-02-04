import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { type Category } from "@prisma/client";
import { useRouter } from "next/navigation";
import { type FC } from "react";

type Props = {
  rows: Category[] | null | undefined;
  loading: boolean;
  link: string;
};
export const CategoryTable: FC<Props> = (props: Props) => {
  const router = useRouter();
  if (!props.rows) props.rows = [];
  const tableHeader = (
    <TableHeader>
      <TableColumn>Title</TableColumn>
      <TableColumn>Description</TableColumn>
    </TableHeader>
  );
  const tableBody = (
    <TableBody
      items={props.rows}
      isLoading={props.loading}
      loadingContent={<Spinner label="Loading..." />}
      emptyContent={"We couldn't find anything"}
    >
      {(category) => (
        <TableRow>
          <TableCell>{category.name}</TableCell>
          <TableCell>
            {category.description == "" ? "—" : category.description}
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
  return (
    <Table
      onRowAction={(key) => router.push(`${props.link}${key}`)}
      isStriped
      selectionMode="single"
    >
      {tableHeader}
      {tableBody}
    </Table>
  );
};
