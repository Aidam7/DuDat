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
import { useRouter } from "next/navigation";
import { useState, type FC } from "react";
import { api } from "~/utils/api";
import { type ITableColumns } from "~/utils/types";

const columns: ITableColumns[] = [
  { label: "User", key: "name" },
  { label: "", key: "actions" },
];
interface Props {
  groupId: string;
}
const GroupTransferOwnership: FC<Props> = (props: Props) => {
  const findUsersQuery = api.users.locateByNameAndGroup;
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  let { data: users } = findUsersQuery.useQuery(
    { name: query, groupId: props.groupId },
    { onSuccess: () => setLoading(false) },
  );
  if (!users) users = [];
  function transferGroup(userId: string) {
    throw new Error(`Not implemented ${userId}`);
  }
  return (
    <>
      <h2 className="text-2xl font-bold">Transfer ownership</h2>
      <input
        placeholder="Search for a new owner"
        className={"inner mb-5 h-10 rounded-md pl-2"}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value), setLoading(true);
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
          emptyContent={"We couldn't find anything"}
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
                  Transfer Ownership
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
                    transferGroup(selectedUserId);
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
