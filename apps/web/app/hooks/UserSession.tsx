import { useSession } from "next-auth/react";

export const useUserSession = () => {
  const { data: session, status } = useSession();

  // Optional: Add custom logic here (e.g., redirect if unauthenticated)
  return { session, status };
};
