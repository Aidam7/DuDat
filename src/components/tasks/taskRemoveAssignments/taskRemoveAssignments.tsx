import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { type Group, type Task } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, type FC } from "react";
import { api } from "~/utils/api";
interface Props {
  group: Group;
  task: Task;
}

const TaskRemoveAssignments: FC<Props> = (props: Props) => {
  const router = useRouter();
  const assignedUsersQuery = api.tasks.getAssignedMembers;
  const [query, setQuery] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedUserId, setSelectedUserId] = useState("");
  const apiUtils = api.useUtils();
  // eslint-disable-next-line prefer-const
  let { data: users, isFetching: loading } = assignedUsersQuery.useQuery({
    taskId: props.task.id,
    groupId: props.group.id,
  });
  const removeAssignmentMutation = api.tasks.unassignUser.useMutation();
  if (!users) users = [];
  users = users.filter((user) => user.id !== props.group.ownerId);
  function removeAssignment(userId: string) {
    removeAssignmentMutation.mutate(
      { taskId: props.task.id, userId },
      {
        onSuccess: () => {
          void apiUtils.tasks.getAssignedMembers.invalidate(),
            void apiUtils.tasks.getUnassignedMembers.invalidate();
        },
      },
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-2xl font-bold">Remove assignees</h2>
      <input
        placeholder="Search for a member"
        className={"inner mb-5 h-10 rounded-md pl-2"}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      ></input>
      <Table
        selectionMode="single"
        aria-label="Member table"
        onRowAction={(key) => router.push(`/users/${key}`)}
      >
        <TableHeader>
          <TableColumn>User</TableColumn>
          <TableColumn>{""}</TableColumn>
        </TableHeader>
        <TableBody
          items={users}
          isLoading={loading}
          loadingContent={<Spinner label="Loading..." />}
          emptyContent={"We couldn't find anyone."}
        >
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
                <Button
                  color="danger"
                  onClick={() => {
                    onOpen();
                    setSelectedUserId(user.id);
                  }}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="bg-black font-mono text-white">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h4>Are you sure you want to unassign this member?</h4>
              </ModalHeader>
              <ModalBody>
                <span></span>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="danger"
                  variant="flat"
                  onClick={() => {
                    removeAssignment(selectedUserId);
                    onClose();
                  }}
                >
                  Proceed
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
export default TaskRemoveAssignments;
