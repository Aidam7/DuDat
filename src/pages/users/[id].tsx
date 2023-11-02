import { useRouter } from "next/router";
import { api } from "~/utils/api";
export default function UserDetail() {
  const router = useRouter();
  const id = router.query.id as string;
  let user;
  if (typeof id === "string") {
    const { data } = api.users.getById.useQuery({ id });
    user = data;
  }
  return (
    <>
      {user ? (
        <>
          <h1 className="bg-slate-600 text-6xl">{user.id}</h1>
          <br></br>
          {user.name}
        </>
      ) : (
        <>404</>
      )}
    </>
  );
}
