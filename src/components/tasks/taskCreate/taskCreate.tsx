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
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, type FC, type FormEvent } from "react";
import DatePicker from "react-datepicker";
import { api } from "~/utils/api";
import { roundToEndOfDay, roundToHalfHour, roundToZero } from "~/utils/func";
interface Props {
  groupId: string;
}
export const TaskCreate: FC<Props> = (props: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [endDate, setEndDate] = useState<Date | null>(
    roundToEndOfDay(new Date()),
  );
  const [startDate, setStartDate] = useState<Date | null>(
    roundToHalfHour(new Date()),
  );
  const [isWish, setIsWish] = useState(false);
  const [isAllDay, setIsAllDay] = useState(false);
  const createTaskMutation = api.tasks.create.useMutation();
  const { data: session } = useSession();
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
    if (isAllDay && startDate && endDate) {
      setStartDate(roundToZero(startDate));
      setEndDate(roundToZero(endDate));
    }
    await createTaskMutation.mutateAsync(
      {
        title: name,
        desc: description,
        parentGroupId: props.groupId,
        authorId: session.user.id,
        assigneeIDs: isWish ? [] : [session.user.id],
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
        <Input
          type="text"
          label="Task Title"
          isRequired
          value={name}
          onValueChange={setName}
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
            onChange={handleStartDateChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            showTimeSelect={!isAllDay}
            isClearable
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
            isClearable
          />
        </div>
        <Switch isSelected={isWish} onValueChange={setIsWish}>
          Is a wish?
        </Switch>
        <Input type="submit" value="Submit" color="primary" />
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
