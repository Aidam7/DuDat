import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter as useNavigation } from "next/navigation";
import { useRouter } from "next/router";
import CenteredLayout from "~/components/layout/centeredLayout";
import Code404 from "~/components/layout/errorCodes/404";
import Loading from "~/components/layout/loading";
import { api } from "~/utils/api";

export default function TaskReroute() {
  const router = useRouter();
  const navigation = useNavigation();
  const id = router.query.id as string;
  const { data: session } = useSession();
  const { data: task, isInitialLoading: loading } =
    api.tasks.getTaskWithGroupId.useQuery(
      {
        taskId: id,
      },
      { enabled: session != null },
    );
  if (loading)
    return (
      <Loading text="You are being redirected to the task, please wait..." />
    );
  if (!task) return <Code404 />;
  navigation.replace(`/groups/${task.groupId}/tasks/${id}`);
  return (
    <CenteredLayout>
      You are being redirected to the task, please wait... If you did not get
      redirected, please click{" "}
      <Link href={`/groups/${task.groupId}/tasks/${id}`}>here</Link>.
    </CenteredLayout>
  );
}
