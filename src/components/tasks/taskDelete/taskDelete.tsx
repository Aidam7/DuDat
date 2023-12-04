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

const TaskDelete: React.FC<Props> = (props: Props) => {
  const taskDeleteMutation = api.tasks.deleteById.useMutation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const handleDelete = async () => {
    await taskDeleteMutation.mutateAsync({ id: props.task.id });
    router.push(`/groups/${props.task.groupId}`);
  };
  return (
    <>
      <Button onPress={onOpen} color="danger" className="w-full">
        Delete this task
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="bg-black font-mono text-white">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h4>Are you sure you want to delete this task?</h4>
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
    </>
  );
};

export default TaskDelete;
