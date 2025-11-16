import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    password: {
      hash: async (password: string) => {
        return bcrypt.hash(password, 10);
      },
      verify: async (data: { password: string; hash: string }) => {
        return bcrypt.compare(data.password, data.hash);
      },
    },
    // Allow authentication with password_hash field directly (for pre-seeded users)
    sendResetPassword: async () => {
      // Mock implementation
    },
  },
  account: {
    modelName: "accounts",
    accountLinking: {
      enabled: false,
    },
  },
  session: {
    modelName: "session",
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "CLIENT",
      },
    },
    modelName: "users",
  },
  trustedOrigins: [
    "http://localhost:3000",
    process.env.NEXT_PUBLIC_APP_URL || "",
  ],
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    cookiePrefix: "cpa_auth",
  },
});

export type Session = typeof auth.$Infer.Session;
