import { Image } from "@nextui-org/react";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Pie } from "react-chartjs-2";
import Code404 from "~/components/layout/errorCodes/404";
import { api } from "~/utils/api";
export default function UserDetail() {
  ChartJS.register(ArcElement, Tooltip, Legend);
  const router = useRouter();
  const id = router.query.id as string;
  const { data: session } = useSession();
  const { data: user, isFetching: loading } = api.users.getById.useQuery(
    { id },
    { enabled: session != null },
  );
  if (!session) return <>Please sign in</>;
  if (loading) return <>Loading...</>;
  if (!user) return <Code404 />;
  const data = {
    labels: ["Finished Tasks", "Finished Tasks Late"],
    datasets: [
      {
        data: [user.finishedTasksCount, user.finishedTasksLateCount],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };
  return (
    <>
      <h1 className="text-6xl">{user.name}</h1>
      {user.image && (
        <Image src={user.image} alt={`Users image`} width={200} height={200} />
      )}
      <div className="w-full max-md:w-[50%] sm:w-[25%]">
        <Pie data={data} />
      </div>
    </>
  );
}
