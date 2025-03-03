/* eslint-disable @typescript-eslint/no-explicit-any */
// app/cash-registers/[cashRegisterId]/sessions/[sessionId]/page.tsx

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prismaClient";
import { CashRegisterService } from "@/services/cash-register";
import { SessionService } from "@/services/sessions";
import { authOptions } from "@/lib/authOptions";
import { AdminSession } from "@/app/components/features/Admin/Session/Sessions";
import { LayoutCCAA } from "@/app/components/Layout";

interface PageProps {
  searchParams: {
    session1: string;
    cashRegister1: string;
    session2?: string;
    cashRegister2?: string;
  };
}

export default async function AdminSessionDetailPage({
  searchParams,
}: PageProps) {
  const { session1, cashRegister1, session2, cashRegister2 } = searchParams;

  let session2Data: any;

  // Get the user session
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const userId = session.user.id;

  console.log(session1, cashRegister1, session2, cashRegister2);

  // Fetch the cash register and verify it belongs to the user
  const cashRegisterService = new CashRegisterService(prisma, userId);
  const cashRegister = await cashRegisterService.getCashRegisterById(
    cashRegister1
  );

  if (!cashRegister) {
    return (
      <div>
        <p>Cash register not found or you do not have access to it.</p>
      </div>
    );
  }

  // Fetch the session and verify it belongs to the cash register
  const session1Service = new SessionService(prisma, cashRegister1);
  const session1Data = await session1Service.getSession(session1);

  if (session2 && cashRegister2) {
    const session2Service = new SessionService(prisma, cashRegister2);
    session2Data = await session2Service.getSession(session2);
  }

  if (!session1Data) {
    return (
      <div>
        <p>Session not found or it does not belong to this cash register.</p>
      </div>
    );
  }

  return (
    <LayoutCCAA>
      <AdminSession session={session1Data as unknown as any} />
      {session2Data && <AdminSession session={session2Data} />}
    </LayoutCCAA>
  );
}
