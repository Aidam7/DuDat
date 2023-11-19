import { Image } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Code404 from "~/components/layout/errorCodes/404";
import { api } from "~/utils/api";
export default function UserDetail() {
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
  return (
    <>
      <h1 className="text-6xl">{user.name}</h1>
      {user.image && (
        <Image src={user.image} alt={`Users image`} width={200} height={200} />
      )}
    </>
  );
}
