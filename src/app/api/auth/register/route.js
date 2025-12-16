import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signupSchema } from "@/lib/schemas";

export async function POST(request) {
  try {
    const body = await request.json();
    const validation = signupSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: validation.error.issues },
        { status: 400 }
      );
    }

    const { email, nickname, password } = validation.data;

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const existingNickname = await prisma.user.findUnique({ where: { nickname } });
    if (existingNickname) {
      return NextResponse.json({ error: "Nickname already taken" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, nickname, password: hashed },
      select: { id: true, email: true, nickname: true, createdAt: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    console.error("POST /api/auth/register error", err);
    return NextResponse.json({ error: "Failed to register" }, { status: 500 });
  }
}
