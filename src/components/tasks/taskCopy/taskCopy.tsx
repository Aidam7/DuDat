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
import { useRouter } from "next/navigation";
import { api } from "~/utils/api";

type Props = {
  task: Task;
};

const TaskCopy: React.FC<Props> = (props: Props) => {
  const taskCopyMutation = api.tasks.cloneTask.useMutation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const handleDelete = async () => {
    const copy = await taskCopyMutation.mutateAsync({ taskId: props.task.id });
    router.push(`/groups/${copy.groupId}/tasks/${copy.id}`);
  };
  return (
    <>
      <Button onPress={onOpen} color="primary">
        Copy this task
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h4>Are you sure you want to copy this task?</h4>
              </ModalHeader>
              <ModalBody>
                A new task will be created, along with assigned users and any
                categories, you will be marked as the author.
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="success" onPress={handleDelete}>
                  Copy
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default TaskCopy;
