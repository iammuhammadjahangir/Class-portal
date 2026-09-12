import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Creates the CR's own roster row as the sole super-admin, so the very
// first login has somewhere to start. Everyone else gets added later
// through the Admin > Roster page. Safe to re-run.
async function main() {
  const name = process.env.ADMIN_NAME || "CR";
  const rollNumber = (process.env.ADMIN_ROLL_NUMBER || "ADMIN-01").trim().toUpperCase();

  const existing = await prisma.student.findUnique({ where: { rollNumber } });
  if (existing) {
    if (!existing.isAdmin) {
      await prisma.student.update({ where: { rollNumber }, data: { isAdmin: true } });
    }
    console.log(`Admin roster entry already exists for ${rollNumber} (${existing.name}).`);
    return;
  }

  await prisma.student.create({
    data: { name, rollNumber, isAdmin: true },
  });
  console.log(`Created admin roster entry: ${name} (${rollNumber}). Log in with this roll number to set your password.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
