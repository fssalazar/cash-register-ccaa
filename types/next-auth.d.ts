/* eslint-disable @typescript-eslint/no-unused-vars */
// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

/**
 * Module augmentation for 'next-auth'
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      lastname: string;
      role: Role;
      companyId: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    name: string;
    lastname: string;
    email: string;
    role: Role;
    companyId: string;
  }

  type Role = "Admin" | "Employee";
}

/**
 * Module augmentation for 'next-auth/jwt'
 */
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    companyId: string;
  }
}
