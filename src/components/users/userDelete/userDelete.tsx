import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { type User } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { type FC } from "react";
import { api } from "~/utils/api";

interface Props {
  user: User;
}

const UserDelete: FC<Props> = (props: Props) => {
  const userDeleteMutation = api.users.deleteById.useMutation();
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onOpenChange: onConfirmOpenChange,
    onClose: onConfirmClose,
  } = useDisclosure();
  const {
    isOpen: isErrorOpen,
    onOpen: onErrorOpen,
    onOpenChange: onErrorOpenChange,
  } = useDisclosure();
  const router = useRouter();
  const handleDelete = async () => {
    await userDeleteMutation.mutateAsync(
      {
        id: props.user.id,
      },
      {
        onSuccess: () => {
          router.push(`/`);
        },
        onError() {
          onConfirmClose();
          onErrorOpen();
        },
      },
    );
  };
  return (
    <>
      <Button onPress={onConfirmOpen} color="danger" className="w-full">
        Delete your account
      </Button>
      <Modal isOpen={isConfirmOpen} onOpenChange={onConfirmOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h1 className="text-2xl">{"Sorry to see you go :("}</h1>
                <h4>Are you sure you want to delete your account?</h4>
              </ModalHeader>
              <ModalBody>
                <span>
                  This process is{" "}
                  <span className="font-bold text-red-500">irreversible</span>.
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
      <Modal isOpen={isErrorOpen} onOpenChange={onErrorOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h4>{"We couldn't delete your account"}</h4>
              </ModalHeader>
              <ModalBody>
                <span>
                  {userDeleteMutation.error?.message ??
                    "An unknown error occurred."}
                </span>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserDelete;
