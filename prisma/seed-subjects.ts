import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// One-off script to load the real Semester 1 subject list. Safe to re-run:
// skips any subject whose name already exists.
const SUBJECTS = [
  { name: "Research Methodology", guideName: "Dr. Arif Ullah" },
  { name: "Advanced Theory of Automata", guideName: "Dr. Arif Ullah" },
  { name: "Advanced Computer Architecture", guideName: "Dr. Bilal Ahmed" },
  { name: "Applied Deep Learning", guideName: "Dr. Fahimullah" },
  { name: "Fehm-e-Quran-I", guideName: "Mr. Abdul Baqi" },
];

async function main() {
  for (const [index, s] of SUBJECTS.entries()) {
    const existing = await prisma.subject.findFirst({ where: { name: s.name } });
    if (existing) {
      console.log(`Skipped (already exists): ${s.name}`);
      continue;
    }
    await prisma.subject.create({ data: { ...s, order: index } });
    console.log(`Created: ${s.name} — ${s.guideName}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
