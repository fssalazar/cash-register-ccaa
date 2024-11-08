"use client";
import { SessionProvider } from "next-auth/react";

export function LocalSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
