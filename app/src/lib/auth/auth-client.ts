import { createAuthClient } from "better-auth/react";
import { UserRole } from "./authorization";

const baseURL =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL,
});

// Helper type for session user with role
export type SessionUser = {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  role: UserRole;
};

export const { signIn, signUp, signOut, useSession } = authClient;
