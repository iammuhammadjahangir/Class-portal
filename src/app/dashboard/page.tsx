import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import TopNav from "@/components/TopNav";
import TaskCard from "@/components/TaskCard";
import MaterialItem from "@/components/MaterialItem";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = session.user.id;

  const [subjects, tasks] = await Promise.all([
    prisma.subject.findMany({
      orderBy: { order: "asc" },
      include: { materials: { orderBy: { createdAt: "desc" } } },
    }),
    prisma.task.findMany({
      include: {
        subject: true,
        completions: { where: { studentId: userId } },
      },
    }),
  ]);

  // Sort: incomplete first (soonest due date first, no-due-date last), then completed.
  const sortedTasks = [...tasks].sort((a, b) => {
    const aDone = a.completions[0]?.completed ?? false;
    const bDone = b.completions[0]?.completed ?? false;
    if (aDone !== bDone) return aDone ? 1 : -1;

    const aDue = a.dueDate ? a.dueDate.getTime() : Infinity;
    const bDue = b.dueDate ? b.dueDate.getTime() : Infinity;
    return aDue - bDue;
  });

  const subjectsWithMaterials = subjects.filter((s) => s.materials.length > 0);

  return (
    <div className="min-h-dvh">
      <TopNav name={session.user.name ?? ""} isAdmin={false} />

      <main className="mx-auto max-w-3xl px-4 py-6">
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Tasks & Assignments</h2>
          <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
            Sorted by what&apos;s due soonest. Tick things off as you finish them.
          </p>
          {sortedTasks.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400 dark:border-slate-700">
              Nothing assigned yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {sortedTasks.map((t) => (
                <TaskCard
                  key={t.id}
                  id={t.id}
                  subjectName={t.subject.name}
                  title={t.title}
                  description={t.description}
                  type={t.type}
                  dueDate={t.dueDate}
                  fileUrl={t.fileUrl}
                  linkUrl={t.linkUrl}
                  initialCompleted={t.completions[0]?.completed ?? false}
                />
              ))}
            </ul>
          )}
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Course Content</h2>
          <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
            Slides and reading material, by subject.
          </p>
          {subjectsWithMaterials.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400 dark:border-slate-700">
              Nothing uploaded yet.
            </p>
          ) : (
            <div className="space-y-5">
              {subjectsWithMaterials.map((s) => (
                <div key={s.id}>
                  <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {s.name}
                    {s.guideName && <span className="ml-2 font-normal text-slate-400">· {s.guideName}</span>}
                  </h3>
                  <ul className="space-y-1.5">
                    {s.materials.map((m) => (
                      <MaterialItem
                        key={m.id}
                        title={m.title}
                        description={m.description}
                        fileUrl={m.fileUrl}
                        linkUrl={m.linkUrl}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
