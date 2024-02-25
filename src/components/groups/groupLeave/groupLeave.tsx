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
import { type FC } from "react";
import { api } from "~/utils/api";
interface Props {
  groupId: string;
}
export const GroupLeave: FC<Props> = (props: Props) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data } = useSession();
  const leaveGroupMutation = api.groups.leave.useMutation();
  const router = useRouter();
  const handleLeave = () => {
    if (!data?.user.id) return;
    leaveGroupMutation.mutate(
      {
        groupId: props.groupId,
        userId: data.user.id,
      },
      {
        onSuccess: () => {
          router.push("/groups");
        },
      },
    );
  };
  return (
    <>
      <Button onPress={onOpen} color="danger">
        Leave this group
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h4>Are you sure you want to leave this group?</h4>
              </ModalHeader>
              <ModalBody>
                <span>
                  You will need to be invited again to join this group.
                </span>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Close
                </Button>
                <Button color="danger" variant="flat" onPress={handleLeave}>
                  Leave
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
