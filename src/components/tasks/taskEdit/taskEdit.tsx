import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
  useDisclosure,
} from "@nextui-org/react";
import { type Task } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, type FC, type FormEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { api } from "~/utils/api";
interface Props {
  task: Task;
}
export const TaskEdit: FC<Props> = (props: Props) => {
  const [title, setTitle] = useState(props.task.title);
  const [description, setDescription] = useState(props.task.description);
  const [endDate, setEndDate] = useState<Date | null>(props.task.dueOn);
  const [startDate, setStartDate] = useState<Date | null>(props.task.startOn);
  //This is fucking stupid
  const defaultAllDay =
    startDate?.getHours() === 0 &&
    endDate?.getHours() === 0 &&
    startDate?.getMinutes() === 0 &&
    endDate?.getMinutes() === 0;
  const [isAllDay, setIsAllDay] = useState(defaultAllDay);
  const { data: session } = useSession();
  const editTaskMutation = api.tasks.edit.useMutation();
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    //*This is the only way I could find that prevents a redirect on the same page
    event.preventDefault();
    if (!session) return null;
    if (startDate && endDate && endDate < startDate) {
      onOpen();
      return null;
    }
    await editTaskMutation.mutateAsync(
      {
        id: props.task.id,
        title: title,
        desc: description,
        dueOn: endDate,
        startOn: startDate,
      },
      {
        onSuccess(task) {
          router.push(`/groups/${task.groupId}/tasks/${task.id}`);
        },
      },
    );
  };

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    if (date && endDate && date > endDate) {
      const newEndDate = new Date(date);
      newEndDate.setDate(newEndDate.getDate() + 1);
      setEndDate(newEndDate);
    }
  };

  return (
    <>
      <form
        className="items-left justify-left flex flex-col gap-5"
        onSubmit={handleSubmit}
      >
        <h3 className="mb-4 text-3xl font-bold">Edit this task</h3>
        <Input
          type="text"
          label="Task Title"
          isRequired
          value={title}
          onValueChange={setTitle}
        />
        <Input
          type="text"
          label="Description"
          value={description}
          onValueChange={setDescription}
        />
        <div>
          <Switch isSelected={isAllDay} onValueChange={setIsAllDay}>
            All day?
          </Switch>
          <br />
          <label>Start On</label>
          <br />
          <DatePicker
            selected={startDate}
            onChange={(date) => handleStartDateChange(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            showTimeSelect={!isAllDay}
            dateFormat={isAllDay ? "dd/MM/yyyy" : "dd/MM/yyyy, HH:mm"}
          />
          <br />
          <label>Due On</label>
          <br />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            showTimeSelect={!isAllDay}
            dateFormat={isAllDay ? "dd/MM/yyyy" : "dd/MM/yyyy, HH:mm"}
          />
        </div>
        <Input type="submit" value="Submit" />
      </form>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="bg-black font-mono text-white">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h4>Due date cannot take place before the start date</h4>
              </ModalHeader>
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
