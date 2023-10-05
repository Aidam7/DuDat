import { api } from "~/utils/api";

export const TaskFunctions: React.FC = () => {
    // ! This is just a temporary thing, I'll split it up later
    const createTaskMutation = api.tasks.create.useMutation();
    const createTask = async (
      title: string,
      description: string | null,
      parentGroupId: string,
      authorId: string,
      dueOn: Date | null,
      assigneeIDs: string[]
    ) => {
      await createTaskMutation.mutateAsync({
        title,
        desc: description,
        parentGroupId,
        authorId,
        dueOn,
        assigneeIDs,
      });
    };
    return <>
    <h1>Create task</h1>
    <button onClick={() => createTask("test", null, "clnbo5abk0005fei8avje7yfa", "clnbo50ri0000fei80fcycqkz", null, ["clnbo50ri0000fei80fcycqkz"])}>TVOŘ</button>
    </>
}