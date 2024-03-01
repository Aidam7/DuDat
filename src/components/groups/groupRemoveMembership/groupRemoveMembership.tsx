import {
  Button,
  Image,
  Input,
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
import { useState, type FC } from "react";
import { api } from "~/utils/api";
interface Props {
  group: Group;
}

const GroupRemoveMembers: FC<Props> = (props: Props) => {
  const findMembersQuery = api.users.locateByNameAndGroup;
  const [query, setQuery] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedUserId, setSelectedUserId] = useState("");
  const apiUtils = api.useUtils();
  // eslint-disable-next-line prefer-const
  let { data: users, isFetching: loading } = findMembersQuery.useQuery({
    name: query,
    groupId: props.group.id,
  });
  const removeMemberMutation = api.groups.removeMember.useMutation();
  if (!users) users = [];
  users = users.filter((user) => user.id !== props.group.ownerId);
  function removeMember(userId: string) {
    removeMemberMutation.mutate(
      { groupId: props.group.id, userId },
      {
        onSuccess: () => {
          void apiUtils.users.locateByNameAndGroup.invalidate(),
            void apiUtils.users.getAllWhereNotMemberOfGroup.invalidate();
        },
      },
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-2xl font-bold">Manage members</h2>
      <Input
        placeholder="Search for a member"
        value={query}
        onValueChange={setQuery}
      ></Input>
      <Table selectionMode="single" aria-label="Member table">
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
                  Kick
                </Button>
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
                <h4>Are you sure you want to kick this member?</h4>
              </ModalHeader>
              <ModalBody>
                <span>
                  You will need to add them back if they wish to access this
                  group again.
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
                    removeMember(selectedUserId);
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
export default GroupRemoveMembers;
