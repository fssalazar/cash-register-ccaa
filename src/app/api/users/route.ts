// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prismaClient";

export async function POST(request: NextRequest) {
  const { email, password, name, lastname, role, companyId } =
    await request.json();

  // Validate input
  if (!email || !password || !name || !lastname || !role || !companyId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        lastname,
        role: role as Role,
        company: { connect: { id: companyId } },
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
