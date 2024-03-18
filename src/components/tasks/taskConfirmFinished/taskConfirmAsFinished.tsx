import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { type Task } from "@prisma/client";
import { useSession } from "next-auth/react";
import React from "react";
import { api } from "~/utils/api";

interface Props {
  task: Task;
}

const TaskConfirmFinished: React.FC<Props> = (props: Props) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const confirmTaskAsFinishedMutation =
    api.tasks.confirmTaskAsFinished.useMutation();
  const { data: session } = useSession();
  const apiUtils = api.useUtils();
  function handleConfirmTaskAsFinished() {
    if (!session || !props.task || props.task.confirmedAsFinished) return;
    if (session.user.id != props.task.authorId) return;
    return confirmTaskAsFinishedMutation.mutate(
      {
        taskId: props.task.id,
      },
      {
        onSuccess: () => {
          void apiUtils.tasks.getById.invalidate({ id: props.task.id });
        },
      },
    );
  }
  if (!props.task.finishedOn) return null;
  return (
    <>
      <Button
        color={props.task.confirmedAsFinished ? "default" : "success"}
        onPress={onOpen}
        disabled={props.task.confirmedAsFinished ? true : false}
        className="w-fit"
      >
        {props.task.confirmedAsFinished
          ? "Confirmed as finished"
          : "Confirm as finished"}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h4>
                  Are you sure you want to confirm this task as being finished?
                </h4>
              </ModalHeader>
              <ModalBody>
                <span>
                  Once confirmed, you will not be able to undo this process
                  without resuming this task.
                </span>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="success"
                  onPress={() => {
                    onClose();
                    handleConfirmTaskAsFinished();
                  }}
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default TaskConfirmFinished;
