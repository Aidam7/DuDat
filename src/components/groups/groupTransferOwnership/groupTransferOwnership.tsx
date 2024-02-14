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
import { type Group } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, type FC } from "react";
import { api } from "~/utils/api";
import { type ITableColumns } from "~/utils/types";

const columns: ITableColumns[] = [
  { label: "User", key: "name" },
  { label: "", key: "actions" },
];
interface Props {
  group: Group;
}
const GroupTransferOwnership: FC<Props> = (props: Props) => {
  const findUsersQuery = api.users.locateByNameAndGroup;
  const [query, setQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const editGroupMutation = api.groups.edit.useMutation();
  // eslint-disable-next-line prefer-const
  let { data: users, isFetching: loading } = findUsersQuery.useQuery({
    name: query,
    groupId: props.group.id,
  });
  if (!users) users = [];
  users = users.filter((user) => user.id !== props.group.ownerId);
  function transferGroup() {
    editGroupMutation.mutate(
      {
        name: props.group.name,
        description: props.group.description,
        ownerId: selectedUserId,
        groupId: props.group.id,
      },
      { onSuccess: () => router.push(`/groups/${props.group.id}`) },
    );
  }
  return (
    <>
      <h2 className="text-2xl font-bold">Transfer ownership</h2>
      <input
        placeholder="Search for a new owner"
        className={"inner mb-5 h-10 rounded-md pl-2"}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      ></input>
      <Table
        isStriped
        onRowAction={(key) => router.push(`/users/${key}`)}
        selectionMode="single"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={users}
          isLoading={loading}
          loadingContent={<Spinner label="Loading..." />}
          emptyContent={"We couldn't find anyone to transfer ownership to."}
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
                {user.id !== props.group.ownerId ? (
                  <Button
                    color="danger"
                    onClick={() => {
                      onOpen();
                      setSelectedUserId(user.id);
                    }}
                  >
                    Transfer Ownership
                  </Button>
                ) : (
                  <span className="text-green-500">Owner</span>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h4>
                  Are you sure you want to transfer ownership of this group?
                </h4>
              </ModalHeader>
              <ModalBody>
                <span>
                  This process is{" "}
                  <span className="font-bold text-red-500">irreversible</span>.
                  You will loose access to this panel.
                </span>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="danger"
                  variant="flat"
                  onClick={() => {
                    transferGroup();
                  }}
                >
                  Proceed
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
export default GroupTransferOwnership;
