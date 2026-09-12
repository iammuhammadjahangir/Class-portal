import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Looks up a roster entry by roll number so the login page can decide
// whether to show "set your password" (first time) or "enter password".
// Only returns the name + claim status — never anything sensitive.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const rollNumber = typeof body?.rollNumber === "string" ? body.rollNumber.trim().toUpperCase() : "";
  if (!rollNumber) {
    return NextResponse.json({ error: "Roll number is required." }, { status: 400 });
  }

  const student = await prisma.student.findUnique({
    where: { rollNumber },
    select: { name: true, passwordHash: true },
  });

  if (!student) {
    return NextResponse.json({ found: false });
  }

  return NextResponse.json({
    found: true,
    name: student.name,
    claimed: !!student.passwordHash,
  });
}
