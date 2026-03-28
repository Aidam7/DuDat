export type AuthGateState = "children" | "loading" | "signIn" | "error";

export const resolveAuthGateState = (
  pathname: string,
  status: string,
): AuthGateState => {
  if (pathname === "/") return "children";
  if (status === "loading") return "loading";
  if (status === "unauthenticated") return "signIn";
  if (status === "authenticated") return "children";
  return "error";
};