import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Removes exactly the preview content added by seed-demo-content.ts, by
// title, so you can go back to an empty slate before real classes start.
const DEMO_TASK_TITLES = [
  "Assignment 1: Research Proposal Outline",
  "Quiz 1: Research Design Basics",
  "Literature Review Submission",
  "Assignment 1: DFA/NFA Equivalence Proofs",
  "Quiz 1: Pumping Lemma",
  "Practice Problems — Chapter 3",
  "Assignment 1: Pipelining & Hazards",
  "Quiz 1: Memory Hierarchy",
  "Cache Simulation Exercise",
  "Assignment 1: Build a Simple Neural Network",
  "Quiz 1: Backpropagation Basics",
  "Dataset Exploration — MNIST",
  "Assignment 1: Tafseer Summary — Surah Al-Fatiha",
  "Quiz 1: Memorization Check — Juz Amma (Part 1)",
  "Reflection Writing",
];

const DEMO_MATERIAL_TITLES = [
  "Week 1 Slides — Introduction to Research Methods",
  "Week 2 Slides — Quantitative vs. Qualitative Research",
  "Reading — Sample Research Paper (APA format)",
  "Week 1 Slides — Finite Automata Review",
  "Week 2 Slides — Pushdown Automata",
  "Reference Notes — Turing Machines",
  "Week 1 Slides — ISA & Performance Metrics",
  "Week 2 Slides — Pipelining",
  "Reading — Cache Coherence Protocols",
  "Week 1 Slides — Intro to Deep Learning",
  "Week 2 Slides — CNNs and Architectures",
  "Reading — Deep Learning Book, Chapter 6",
  "Week 1 Notes — Introduction to Tafseer",
  "Week 2 Notes — Themes of Surah Al-Baqarah",
  "Recitation Guide",
];

async function main() {
  const tasks = await prisma.task.deleteMany({ where: { title: { in: DEMO_TASK_TITLES } } });
  const materials = await prisma.material.deleteMany({ where: { title: { in: DEMO_MATERIAL_TITLES } } });
  console.log(`Removed ${tasks.count} demo tasks and ${materials.count} demo materials.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
