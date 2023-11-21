import {
  Button,
  Image,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { type Group, type Task } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, type FC } from "react";
import { api } from "~/utils/api";

type Props = {
  group: Group;
  task: Task;
};
export const TaskAddAssignments: FC<Props> = (props: Props) => {
  //TODO: Add handling
  const router = useRouter();
  const unAssignedUsersQuery = api.tasks.getUnassignedMembers;
  const [query, setQuery] = useState("");
  // eslint-disable-next-line prefer-const
  let { data: unAssignedUsers, isFetching: loading } =
    unAssignedUsersQuery.useQuery({
      taskId: props.task.id,
      groupId: props.group.id,
    });
  if (!unAssignedUsers) unAssignedUsers = [];
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-2xl font-bold">Manage members</h2>
      <input
        placeholder="Search for a member"
        className={"inner mb-5 h-10 rounded-md pl-2"}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      ></input>
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
          items={unAssignedUsers}
          isLoading={loading}
          loadingContent={<Spinner label="Loading..." />}
          emptyContent={"We couldn't find anything"}
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
              <TableCell>
                <Button>Add</Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
