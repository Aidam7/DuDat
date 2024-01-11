import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { type Category } from "@prisma/client";
import { useRouter } from "next/navigation";
import { api } from "~/utils/api";

type Props = {
  category: Category;
};

const CategoryDelete: React.FC<Props> = (props: Props) => {
  const taskDeleteMutation = api.categories.delete.useMutation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const handleDelete = async () => {
    await taskDeleteMutation.mutateAsync({ id: props.category.id });
    router.push(`/groups/${props.category.groupId}`);
  };
  return (
    <>
      <Button onPress={onOpen} color="danger" className="w-full">
        Delete this category
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="bg-black font-mono text-white">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h4>Are you sure you want to delete this category?</h4>
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

export default CategoryDelete;
