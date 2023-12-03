import {
  Button,
  Image,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { type Group } from "@prisma/client";
import { useState, type FC } from "react";
import { api } from "~/utils/api";
interface Props {
  group: Group;
}

const GroupAddMembers: FC<Props> = (props: Props) => {
  const findNonMembersQuery = api.users.getAllWhereNotMemberOfGroup;
  const [query, setQuery] = useState("");
  // eslint-disable-next-line prefer-const
  let { data: nonMembers, isFetching: loading } = findNonMembersQuery.useQuery(
    {
      groupId: props.group.id,
      userName: query,
    },
    { enabled: query != "" },
  );
  if (!nonMembers) nonMembers = [];
  const addMemberMutation = api.groups.addMember.useMutation();
  const apiUtils = api.useUtils();
  function addMember(userId: string) {
    addMemberMutation.mutate(
      { groupId: props.group.id, userId },
      {
        onSuccess: () => {
          void apiUtils.users.getAllWhereNotMemberOfGroup.invalidate(),
            void apiUtils.users.locateByNameAndGroup.invalidate();
        },
      },
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-2xl font-bold">Add members</h2>
      <input
        placeholder="Search for a new member"
        className={"inner mb-5 h-10 rounded-md pl-2"}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      ></input>
      <Table selectionMode="single" aria-label="Member table">
        <TableHeader>
          <TableColumn>User</TableColumn>
          <TableColumn>{""}</TableColumn>
        </TableHeader>
        <TableBody
          items={nonMembers}
          isLoading={loading}
          loadingContent={<Spinner label="Loading..." />}
          emptyContent={query == "" ? "Search for a user" : "No users found"}
        >
          {(user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center justify-start space-x-5">
                  <Image
                    className="mr-2 rounded-lg max-md:hidden"
                    height={64}
                    width={64}
                    src={user.image ? user.image : ""}
                    alt={`${user.name}'s avatar`}
                  />
                  <span>{user.name}</span>
                </div>
              </TableCell>
              <TableCell align="right">
                <Button
                  color="primary"
                  onClick={() => {
                    addMember(user.id);
                  }}
                >
                  Add
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
export default GroupAddMembers;
