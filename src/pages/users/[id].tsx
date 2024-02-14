import { Image } from "@nextui-org/react";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { useRouter } from "next/router";
import { Pie } from "react-chartjs-2";
import Code404 from "~/components/layout/errorCodes/404";
import Loading from "~/components/layout/loading";
import PageHeader from "~/components/layout/pageHeader";
import { api } from "~/utils/api";
import { type IBreadcrumb } from "~/utils/types";
export default function UserDetail() {
  ChartJS.register(ArcElement, Tooltip, Legend);
  const router = useRouter();
  const id = router.query.id as string;
  const { data: user, isFetching: loading } = api.users.getById.useQuery({
    id,
  });
  if (loading) return <Loading />;
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
  const breadcrumbs: IBreadcrumb[] = [
    { name: "Users", link: "/" },
    { name: user.name, link: `.` },
  ];
  return (
    <>
      <PageHeader name={user.name} breadcrumbs={breadcrumbs} />
      <Image src={user.image} alt={`Users image`} width={200} height={200} />
      <div className="w-full max-md:w-[50%] sm:w-[25%]">
        <Pie data={data} />
      </div>
    </>
  );
}
