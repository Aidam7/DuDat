import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "~/utils/api";

type Props = {
  groupId: string;
};

const GroupDelete: React.FC<Props> = (props: Props) => {
  const { data: session } = useSession();
  const { data: isOwner } = api.users.isOwnerOfGroup.useQuery(
    {
      groupId: props.groupId,
      userId: session!.user.id,
    },
    {
      enabled: session !== null,
    },
  );
  const groupDeleteMutation = api.groups.deleteById.useMutation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const handleDelete = async () => {
    await groupDeleteMutation.mutateAsync({ id: props.groupId });
    router.push("/groups");
  };
  if (!isOwner) return null;
  return (
    <>
      <Button onPress={onOpen} color="danger" className="w-full">
        Delete this group
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="bg-black font-mono text-white">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h4>Are you sure you want to delete this group?</h4>
              </ModalHeader>
              <ModalBody>
                <span>
                  This process is{" "}
                  <span className="font-bold text-red-500">irreversible</span>.
                  All tasks will be deleted too.
                </span>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Close
                </Button>
                <Button color="danger" variant="flat" onPress={handleDelete}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupDelete;
