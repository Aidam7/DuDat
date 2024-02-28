import { Image } from "@nextui-org/react";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { useRouter } from "next/router";
import { Pie } from "react-chartjs-2";
import Code404 from "~/components/layout/errorCodes/404";
import Loading from "~/components/layout/loading";
import PageHeader from "~/components/layout/pageHeader";
import UserActionPanel from "~/components/users/userActionPanel";
import UserDisplayStreak from "~/components/users/userStreakDisplay";
import { api } from "~/utils/api";
import { type IBreadcrumb } from "~/utils/types";
export default function UserDetail() {
  ChartJS.register(ArcElement, Tooltip, Legend);
  const router = useRouter();
  const id = router.query.id as string;
  const { data: user, isInitialLoading: loading } = api.users.getById.useQuery({
    id,
  });
  if (loading) return <Loading />;
  if (!user) return <Code404 />;
  const data = {
    labels: ["Finished tasks on time", "Finished tasks tate"],
    datasets: [
      {
        data: [user.finishedTasksCount, user.finishedTasksLateCount],
        backgroundColor: ["#36A2EB", "#dc2626"],
        hoverBackgroundColor: ["#36A2EB", "#dc2626"],
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
      <div className="items-top flex flex-row gap-5">
        <Image src={user.image} alt={`Users image`} width={200} height={200} />{" "}
        <UserActionPanel user={user} />
      </div>
      <div className="flex w-full flex-col gap-5 max-md:w-full sm:w-[25%]">
        <h2 className="text-4xl font-semibold">Tasks</h2>
        <UserDisplayStreak user={user} />
        <div>
          <p className="text-2xl">
            Finished tasks:{" "}
            <span className="">
              {user.finishedTasksCount + user.finishedTasksLateCount}
            </span>
          </p>
          <p className="pl-5 text-xl">
            Finished tasks late:{" "}
            <span className="">{user.finishedTasksLateCount}</span>
          </p>
          <p className="pl-5 text-xl">
            Finished tasks on time:{" "}
            <span className="">{user.finishedTasksCount}</span>
          </p>
        </div>
        <Pie data={data} />
      </div>
    </>
  );
}
