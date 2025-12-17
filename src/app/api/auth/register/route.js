import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signupSchema } from "@/lib/schemas";

const normalizeEmail = (email) => email.trim().toLowerCase();

const ensureEmailUnique = async (email) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }
  return null;
};

export async function POST(request) {
  try {
    const body = await request.json();
    const validation = signupSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: validation.error.issues },
        { status: 400 },
      );
    }

    const { email, password } = validation.data;
    const normalizedEmail = normalizeEmail(email);

    const emailConflict = await ensureEmailUnique(normalizedEmail);
    if (emailConflict) return emailConflict;

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email: normalizedEmail, password: hashed },
      select: { id: true, email: true, createdAt: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    console.error("POST /api/auth/register error", err);
    return NextResponse.json({ error: "Failed to register" }, { status: 500 });
  }
}
