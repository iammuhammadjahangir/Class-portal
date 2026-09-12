import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import TopNav from "@/components/TopNav";
import TaskRow from "@/components/TaskRow";
import MaterialRow from "@/components/MaterialRow";

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

      <main className="mx-auto max-w-2xl px-4 py-10">
        <section>
          <div className="border-b border-stone-200 pb-3 dark:border-stone-800">
            <p className="text-[11px] uppercase tracking-[0.14em] text-accent-600 dark:text-accent-400">
              What&apos;s due
            </p>
            <h2 className="mt-0.5 font-serif text-xl font-semibold text-stone-900 dark:text-white">
              Tasks & Assignments
            </h2>
          </div>
          {sortedTasks.length === 0 ? (
            <p className="py-6 text-sm text-stone-400">Nothing assigned yet.</p>
          ) : (
            <div className="divide-y divide-stone-200 dark:divide-stone-800">
              {sortedTasks.map((t) => (
                <TaskRow
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
            </div>
          )}
        </section>

        <section className="mt-12">
          <div className="border-b border-stone-200 pb-3 dark:border-stone-800">
            <p className="text-[11px] uppercase tracking-[0.14em] text-stone-400 dark:text-stone-500">Reference</p>
            <h2 className="mt-0.5 font-serif text-xl font-semibold text-stone-900 dark:text-white">Course Content</h2>
          </div>
          {subjectsWithMaterials.length === 0 ? (
            <p className="py-6 text-sm text-stone-400">Nothing uploaded yet.</p>
          ) : (
            <div>
              {subjectsWithMaterials.map((s) => (
                <div key={s.id} className="border-b border-stone-200 py-5 last:border-0 dark:border-stone-800">
                  <h3 className="font-serif text-base text-stone-900 dark:text-white">
                    {s.name}
                    {s.guideName && <span className="ml-2 font-sans text-sm font-normal text-stone-400">{s.guideName}</span>}
                  </h3>
                  <div className="mt-1 divide-y divide-stone-100 dark:divide-stone-900">
                    {s.materials.map((m) => (
                      <MaterialRow
                        key={m.id}
                        title={m.title}
                        description={m.description}
                        fileUrl={m.fileUrl}
                        linkUrl={m.linkUrl}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
