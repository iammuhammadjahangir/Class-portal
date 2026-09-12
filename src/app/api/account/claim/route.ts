import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// First-time setup: a student claims their pre-loaded roster row by
// setting a password. Fails if already claimed (prevents someone from
// resetting a classmate's password just by knowing their roll number).
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const rollNumber = typeof body?.rollNumber === "string" ? body.rollNumber.trim().toUpperCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!rollNumber || !password || password.length < 6) {
    return NextResponse.json(
      { error: "Roll number and a password of at least 6 characters are required." },
      { status: 400 }
    );
  }

  const student = await prisma.student.findUnique({ where: { rollNumber } });
  if (!student) {
    return NextResponse.json({ error: "No roster entry found for that roll number." }, { status: 404 });
  }
  if (student.passwordHash) {
    return NextResponse.json(
      { error: "This account is already set up. Please log in instead." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.student.update({
    where: { rollNumber },
    data: { passwordHash, claimedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
