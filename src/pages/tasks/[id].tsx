import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter as useNavigation } from "next/navigation";
import { useRouter } from "next/router";
import Code404 from "~/components/layout/errorCodes/404";
import Loading from "~/components/layout/loading";
import { api } from "~/utils/api";

export default function TaskReroute() {
  const router = useRouter();
  const navigation = useNavigation();
  const id = router.query.id as string;
  const { data: session } = useSession();
  const { data: groupId, isInitialLoading: loading } =
    api.tasks.getTaskWithGroupId.useQuery(
      {
        taskId: id,
      },
      { enabled: session != null },
    );
  if (loading) return <Loading />;
  if (!groupId) return <Code404 />;
  navigation.replace(`/groups/${groupId.groupId}/tasks/${id}`);
  return (
    <>
      You are being redirected to the task, please wait... If you did not get
      redirected, please click{" "}
      <Link href={`/groups/${groupId.groupId}/tasks/${id}`}>here</Link>.
    </>
  );
}
