import { Checkbox, Input } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, type FC, type FormEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { api } from "~/utils/api";
import { roundToEndOfDay, roundToHalfHour } from "~/utils/func";
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
  const createTaskMutation = api.tasks.create.useMutation();
  const { data: session } = useSession();
  const router = useRouter();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    //*This is the only way I could find that prevents a redirect on the same page
    event.preventDefault();
    if (!session) return null;
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

  return (
    <>
      <form
        className="items-left justify-left flex flex-col gap-5"
        onSubmit={handleSubmit}
      >
        <h3 className="mb-4 text-3xl font-bold">Create a task</h3>
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
          <label>Start On</label>
          <br />
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            showTimeSelect
            timeFormat="p"
            dateFormat="Pp"
            isClearable
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
            showTimeSelect
            timeFormat="p"
            dateFormat="Pp"
            isClearable
          />
        </div>
        <Checkbox isSelected={isWish} onValueChange={setIsWish}>
          Is a wish?
        </Checkbox>
        <Input type="submit" value="Submit" />
      </form>
    </>
  );
};
