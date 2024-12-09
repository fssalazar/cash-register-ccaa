import { PrismaClient, CashRegister } from "@prisma/client";

export class CashRegisterService {
  private prisma: PrismaClient;
  private userId: string;

  constructor(prisma: PrismaClient, userId: string) {
    this.prisma = prisma;
    this.userId = userId;
  }

  /**
   * Retrieves the cash register associated with the userId.
   */
  async getCashRegisterByUserId(): Promise<CashRegister | null> {
    try {
      const cashRegister = await this.prisma.cashRegister.findFirst({
        where: {
          userId: this.userId,
        },
      });
      return cashRegister;
    } catch (error) {
      console.error("Error fetching cash register by userId:", error);
      throw error;
    }
  }

  async getCashRegisterById(id: string): Promise<CashRegister | null> {
    try {
      const cashRegister = await this.prisma.cashRegister.findUnique({
        where: {
          id: id,
        },
      });
      return cashRegister;
    } catch (error) {
      console.error("Error fetching cash register by userId:", error);
      throw error;
    }
  }

  /**
   * Retrieves all cash registers associated with the given companyId.
   * @param companyId - The ID of the company.
   */
  async getCashRegistersByCompanyId(
    companyId: string
  ): Promise<CashRegister[]> {
    try {
      const cashRegisters = await this.prisma.cashRegister.findMany({
        where: {
          companyId: companyId,
        },
      });
      return cashRegisters;
    } catch (error) {
      console.error("Error fetching cash registers by companyId:", error);
      throw error;
    }
  }
}
