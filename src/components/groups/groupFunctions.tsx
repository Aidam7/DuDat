import { api } from "~/utils/api";

export const GroupFunctions: React.FC = () => {
  //! This is just a dev thing
  const deleteGroupMutation = api.groups.deleteById.useMutation();
  const deleteGroup = (id: string) => async () => {
    await deleteGroupMutation.mutateAsync({ id });
  };  
  return (
    <>
      <h1>Groups</h1>
      <button onClick={deleteGroup("")}>MAŽ</button>
    </>
  );
};
