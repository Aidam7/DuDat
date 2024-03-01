import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  useDisclosure,
} from "@nextui-org/react";
import { type User } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useState, type FC } from "react";
import { api } from "~/utils/api";

interface Props {
  user: User;
}

const UserDelete: FC<Props> = (props: Props) => {
  const userDeleteMutation = api.users.deleteById.useMutation();
  const { data: user, isFetching } = api.users.getByIdExtended.useQuery({
    id: props.user.id,
  });
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
  const [errorMessage, setErrorMessage] = useState("An unknown error occurred");
  if (!user) return null;
  const handleDelete = async () => {
    console.log(user.groupOwnership);
    if (user.groupOwnership.length > 0) {
      setErrorMessage(
        "Please transfer all your groups before deleting your account.",
      );
      onConfirmClose();
      onErrorOpen();
      return;
    }
    await userDeleteMutation.mutateAsync(
      {
        id: props.user.id,
      },
      {
        onSuccess: () => {
          router.push(`/`);
          router.refresh();
        },
        onError() {
          setErrorMessage(
            userDeleteMutation.error?.message ?? "An unknown error occurred",
          );
          onConfirmClose();
          onErrorOpen();
        },
      },
    );
  };
  return (
    <>
      <Skeleton isLoaded={!isFetching} className="rounded-xl bg-danger">
        <Button onPress={onConfirmOpen} color="danger" className="w-full">
          Delete your account
        </Button>
      </Skeleton>
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
                <span>{errorMessage}</span>
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
