/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/cashregisters/route.ts
import { prisma } from "@/lib/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, userId, companyId } = await request.json();

    // Validate input
    if (!name || !userId || !companyId) {
      return NextResponse.json(
        { error: "Missing required fields: name, userId, companyId" },
        { status: 400 }
      );
    }

    // Create CashRegister
    const cashRegister = await prisma.cashRegister.create({
      data: {
        name,
        user: { connect: { id: userId } },
        company: { connect: { id: companyId } },
      },
    });

    return NextResponse.json(cashRegister, { status: 201 });
  } catch (error: any) {
    console.error("Error creating CashRegister:", error);

    return NextResponse.json(
      { error: "Error creating CashRegister" },
      { status: 500 }
    );
  }
}
