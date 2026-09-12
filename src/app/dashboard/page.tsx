import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import TopNav from "@/components/TopNav";
import { subjectStatus, type SubjectStatusTone } from "@/lib/dates";

const STATUS_STYLE: Record<SubjectStatusTone, string> = {
  overdue: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400",
  today: "bg-accent-100 text-accent-800 dark:bg-accent-950/70 dark:text-accent-300",
  soon: "bg-accent-50 text-accent-700 dark:bg-accent-950/50 dark:text-accent-400",
  upcoming: "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300",
  done: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
  none: "bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-500",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = session.user.id;

  const subjects = await prisma.subject.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { materials: true } },
      tasks: { select: { dueDate: true, completions: { where: { studentId: userId }, select: { completed: true } } } },
    },
  });

  return (
    <div className="min-h-dvh">
      <TopNav name={session.user.name ?? ""} isAdmin={false} />

      <main className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-[11px] uppercase tracking-[0.14em] text-accent-600 dark:text-accent-400">
          Semester 1 · Fall 2026
        </p>
        <h1 className="mt-0.5 font-serif text-2xl font-semibold text-stone-900 dark:text-white">Your subjects</h1>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          Open a subject for its slides, reading, and what&apos;s due.
        </p>

        {subjects.length === 0 ? (
          <p className="mt-8 text-sm text-stone-400">Nothing here yet — check back once your CR adds subjects.</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {subjects.map((s) => {
              const status = subjectStatus(
                s.tasks.map((t) => ({ dueDate: t.dueDate, completed: t.completions[0]?.completed ?? false }))
              );
              return (
                <Link
                  key={s.id}
                  href={`/dashboard/subjects/${s.id}`}
                  className="rounded-lg border border-stone-200 bg-white p-4 transition hover:border-accent-300 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-accent-700"
                >
                  <p className="font-serif text-lg text-stone-900 dark:text-white">{s.name}</p>
                  {s.guideName && <p className="text-sm text-stone-500 dark:text-stone-400">{s.guideName}</p>}
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[status.tone]}`}>
                      {status.text}
                    </span>
                    <span className="text-xs text-stone-400">{s._count.materials} materials</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
