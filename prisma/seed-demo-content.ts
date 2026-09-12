import { PrismaClient, TaskType, MaterialTag } from "@prisma/client";

const prisma = new PrismaClient();

// Preview-only content so you can see the portal filled in. Safe to re-run
// (skips a task/material if one with the same title already exists under
// that subject) — and easy to wipe later with prisma/clear-demo-content.ts.
const DEMO: Record<
  string,
  {
    tasks: { title: string; type: TaskType; dueDate: string | null; description: string }[];
    materials: { title: string; description: string; tag: MaterialTag }[];
  }
> = {
  "Research Methodology": {
    tasks: [
      { title: "Assignment 1: Research Proposal Outline", type: "ASSIGNMENT", dueDate: "2026-09-18", description: "2-page outline: problem statement, research questions, and proposed method." },
      { title: "Quiz 1: Research Design Basics", type: "QUIZ", dueDate: "2026-09-14", description: "Covers quantitative vs. qualitative design, from week 1–2 slides." },
      { title: "Literature Review Submission", type: "TASK", dueDate: "2026-09-10", description: "Submit 5 summarized papers relevant to your proposal topic." },
    ],
    materials: [
      { title: "Week 1 Slides — Introduction to Research Methods", description: "Overview of the research process.", tag: "SLIDES" },
      { title: "Week 2 Slides — Quantitative vs. Qualitative Research", description: "", tag: "SLIDES" },
      { title: "Reading — Sample Research Paper (APA format)", description: "Reference for formatting your proposal.", tag: "READING" },
    ],
  },
  "Advanced Theory of Automata": {
    tasks: [
      { title: "Assignment 1: DFA/NFA Equivalence Proofs", type: "ASSIGNMENT", dueDate: "2026-09-20", description: "Prove equivalence for the 3 automata given in class." },
      { title: "Quiz 1: Pumping Lemma", type: "QUIZ", dueDate: "2026-09-17", description: "" },
      { title: "Practice Problems — Chapter 3", type: "TASK", dueDate: null, description: "Optional, for extra practice before the quiz." },
    ],
    materials: [
      { title: "Week 1 Slides — Finite Automata Review", description: "", tag: "SLIDES" },
      { title: "Week 2 Slides — Pushdown Automata", description: "", tag: "SLIDES" },
      { title: "Reference Notes — Turing Machines", description: "", tag: "READING" },
    ],
  },
  "Advanced Computer Architecture": {
    tasks: [
      { title: "Assignment 1: Pipelining & Hazards", type: "ASSIGNMENT", dueDate: "2026-09-25", description: "Identify and resolve hazards in the given instruction sequence." },
      { title: "Quiz 1: Memory Hierarchy", type: "QUIZ", dueDate: "2026-09-13", description: "Cache levels, hit/miss rates, locality of reference." },
      { title: "Cache Simulation Exercise", type: "TASK", dueDate: "2026-09-28", description: "" },
    ],
    materials: [
      { title: "Week 1 Slides — ISA & Performance Metrics", description: "", tag: "SLIDES" },
      { title: "Week 2 Slides — Pipelining", description: "", tag: "SLIDES" },
      { title: "Reading — Cache Coherence Protocols", description: "", tag: "READING" },
    ],
  },
  "Applied Deep Learning": {
    tasks: [
      { title: "Assignment 1: Build a Simple Neural Network", type: "ASSIGNMENT", dueDate: "2026-09-22", description: "From scratch, no frameworks — NumPy only." },
      { title: "Quiz 1: Backpropagation Basics", type: "QUIZ", dueDate: "2026-09-16", description: "" },
      { title: "Dataset Exploration — MNIST", type: "TASK", dueDate: null, description: "Load, visualize, and summarize the dataset before next class." },
    ],
    materials: [
      { title: "Week 1 Slides — Intro to Deep Learning", description: "", tag: "SLIDES" },
      { title: "Week 2 Slides — CNNs and Architectures", description: "", tag: "SLIDES" },
      { title: "Reading — Deep Learning Book, Chapter 6", description: "Optional but recommended.", tag: "READING" },
    ],
  },
  "Fehm-e-Quran-I": {
    tasks: [
      { title: "Assignment 1: Tafseer Summary — Surah Al-Fatiha", type: "ASSIGNMENT", dueDate: "2026-09-19", description: "" },
      { title: "Quiz 1: Memorization Check — Juz Amma (Part 1)", type: "QUIZ", dueDate: "2026-09-15", description: "" },
      { title: "Reflection Writing", type: "TASK", dueDate: "2026-09-30", description: "One page, personal reflection on this week's themes." },
    ],
    materials: [
      { title: "Week 1 Notes — Introduction to Tafseer", description: "", tag: "COURSEWORK" },
      { title: "Week 2 Notes — Themes of Surah Al-Baqarah", description: "", tag: "COURSEWORK" },
      { title: "Recitation Guide", description: "", tag: "COURSEWORK" },
    ],
  },
};

async function main() {
  const subjects = await prisma.subject.findMany();

  for (const subject of subjects) {
    const demo = DEMO[subject.name];
    if (!demo) {
      console.log(`No demo content mapped for "${subject.name}", skipping.`);
      continue;
    }

    for (const t of demo.tasks) {
      const exists = await prisma.task.findFirst({ where: { subjectId: subject.id, title: t.title } });
      if (exists) continue;
      await prisma.task.create({
        data: {
          subjectId: subject.id,
          title: t.title,
          type: t.type,
          dueDate: t.dueDate ? new Date(t.dueDate) : null,
          description: t.description || null,
        },
      });
    }

    for (const m of demo.materials) {
      const exists = await prisma.material.findFirst({ where: { subjectId: subject.id, title: m.title } });
      if (exists) continue;
      await prisma.material.create({
        data: {
          subjectId: subject.id,
          title: m.title,
          description: m.description || null,
          tag: m.tag,
          linkUrl: "https://drive.google.com/",
        },
      });
    }

    console.log(`Seeded demo content for "${subject.name}".`);
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
