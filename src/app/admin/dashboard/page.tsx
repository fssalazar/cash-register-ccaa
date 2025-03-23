// app/page.tsx

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import { LayoutCCAA } from "@/app/components/Layout";
import { prisma } from "@/lib/prismaClient";
import { SessionService } from "@/services/sessions";
import { CashRegisterService } from "@/services/cash-register";
import { CashRegister } from "@/app/components/features/Admin/CashRegister";
interface PageProps {
  searchParams?: Record<string, string | string[]>;
}

const AdminDashboard = async ({ searchParams }: PageProps) => {
  const page = await parseInt((searchParams?.page as string) ?? "1", 10);
  const size = await parseInt((searchParams?.size as string) ?? "10", 10);
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "Admin") {
    redirect("/");
  }

  const sessionService = new SessionService(
    prisma,
    undefined,
    session.user.companyId
  );
  const sessions = await sessionService.getSessionsByCompanyId(page, size);

  const cashRegisterService = new CashRegisterService(
    prisma,
    session.user.id,
    session.user.companyId
  );
  const cashRegisters = await cashRegisterService.getCashRegistersByCompanyId();
  return (
    <LayoutCCAA>
      <CashRegister cashRegisters={cashRegisters} sessions={sessions} />
    </LayoutCCAA>
  );
};

export default AdminDashboard;
