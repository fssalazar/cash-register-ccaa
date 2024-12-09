// services/SessionService.ts

import { PrismaClient, Session } from "@prisma/client";

interface CreateRecordDTO {
  code: string;
  action: string;
  value: number;
  sessionId: string;
}

export class SessionService {
  private prisma: PrismaClient;
  private cashRegisterId: string;

  constructor(prisma: PrismaClient, cashRegisterId: string) {
    this.prisma = prisma;
    this.cashRegisterId = cashRegisterId;
  }

  /**
   * Retrieves paginated sessions for the cash register.
   * Excludes the 'records' array.
   */
  async getSessions(page: number, size: number): Promise<Session[]> {
    try {
      const sessions = await this.prisma.session.findMany({
        where: {
          cashRegisterId: this.cashRegisterId,
        },
        skip: (page - 1) * size,
        take: size,
        orderBy: {
          openDate: "desc",
        },
        select: {
          id: true,
          openDate: true,
          openAmount: true,
          closeDate: true,
          closure: true,
          cashRegisterId: true,
          // Exclude 'records' for performance
        },
      });
      return sessions;
    } catch (error) {
      console.error("Error fetching sessions:", error);
      throw error;
    }
  }

  /**
   * Retrieves a specific session by ID, including 'records'.
   */
  async getSession(sessionId: string): Promise<Session | null> {
    try {
      const session = await this.prisma.session.findUnique({
        where: {
          id: sessionId,
        },
        include: {
          records: true,
        },
      });
      return session;
    } catch (error) {
      console.error("Error fetching session:", error);
      throw error;
    }
  }

  /**
   * Creates a new session.
   */
  async createSession(openDate: Date, openAmount: number): Promise<Session> {
    try {
      const session = await this.prisma.session.create({
        data: {
          openDate,
          openAmount,
          cashRegisterId: this.cashRegisterId,
        },
      });
      return session;
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  }

  async createRecordInSession({
    action,
    code,
    sessionId,
    value,
  }: CreateRecordDTO) {
    const record = await this.prisma.record.create({
      data: {
        code: code,
        action: action,
        value: value,
        session: { connect: { id: sessionId } },
      },
    });
    return record;
  }
}