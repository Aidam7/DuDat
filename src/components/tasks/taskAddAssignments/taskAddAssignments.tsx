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
  const router = useRouter();
  const unAssignedUsersQuery = api.tasks.getUnassignedMembers;
  const addAssignmentMutation = api.tasks.assignUser.useMutation();
  const [query, setQuery] = useState("");
  const apiUtils = api.useUtils();
  const { data: unAssignedUsers, isFetching: loading } =
    unAssignedUsersQuery.useQuery({
      taskId: props.task.id,
      groupId: props.group.id,
    });
  function addAssignment(userId: string) {
    addAssignmentMutation.mutate(
      { taskId: props.task.id, userId },
      {
        onSuccess: () => {
          void apiUtils.tasks.getUnassignedMembers.invalidate();
          void apiUtils.tasks.getAssignedMembers.invalidate();
        },
      },
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-2xl font-bold">Add assignees</h2>
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
                <Button color="primary" onClick={() => addAssignment(user.id)}>
                  Add
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
