"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/page.tsx

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prismaClient";
import { CashRegisterService } from "@/services/cash-register";
import { authOptions } from "@/lib/authOptions";
import { SessionService } from "@/services/sessions";
import { CashRegister } from "./components/features/CashRegister/CashRegister";
import { LayoutCCAA } from "./components/Layout";

interface PageProps {
  searchParams?: Record<string, string | string[]>;
}

export default async function Home({ searchParams }: PageProps) {
  const page = parseInt((searchParams?.page as string) ?? "1", 10);
  const size = parseInt((searchParams?.size as string) ?? "10", 10);
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  if (session.user.role === "Admin") {
    redirect("/admin/dashboard");
  }

  const cashRegisterService = new CashRegisterService(prisma, session.user.id);

  // Fetch the cash register assigned to the user
  const cashRegister = await cashRegisterService.getCashRegisterByUserId();

  // Now, get the sessions associated with the cash register
  const cashRegisterId = cashRegister?.id;

  let sessions: any[] = [];
  if (cashRegisterId) {
    // Instantiate the SessionService with the cashRegisterId
    const sessionService = new SessionService(prisma, cashRegisterId);
    // Get sessions (e.g., page 1, size 10)
    sessions = await sessionService.getSessions(page, size);
  }

  return (
    <LayoutCCAA>
      <CashRegister cashRegister={cashRegister} sessions={sessions} />
    </LayoutCCAA>
  );
}
