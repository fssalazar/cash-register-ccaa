// app/api/companies/route.ts
import { prisma } from "@/lib/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { name } = await request.json();

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  try {
    const company = await prisma.company.create({
      data: { name },
    });
    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json(
      { error: "Error creating company" },
      { status: 500 }
    );
  }
}
