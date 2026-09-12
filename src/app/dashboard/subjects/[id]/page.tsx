import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import TopNav from "@/components/TopNav";
import TaskRow from "@/components/TaskRow";
import MaterialFilterList from "@/components/MaterialFilterList";

export default async function StudentSubjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = session.user.id;

  const subject = await prisma.subject.findUnique({
    where: { id },
    include: {
      materials: { orderBy: { createdAt: "desc" } },
      tasks: {
        include: { completions: { where: { studentId: userId } } },
      },
    },
  });
  if (!subject) notFound();

  const sortedTasks = [...subject.tasks].sort((a, b) => {
    const aDone = a.completions[0]?.completed ?? false;
    const bDone = b.completions[0]?.completed ?? false;
    if (aDone !== bDone) return aDone ? 1 : -1;
    const aDue = a.dueDate ? a.dueDate.getTime() : Infinity;
    const bDue = b.dueDate ? b.dueDate.getTime() : Infinity;
    return aDue - bDue;
  });

  return (
    <div className="min-h-dvh">
      <TopNav name={session.user.name ?? ""} isAdmin={false} />

      <main className="mx-auto max-w-2xl px-4 py-10">
        <Link href="/dashboard" className="text-xs font-medium text-stone-400 hover:text-stone-700 dark:hover:text-stone-200">
          ← Your subjects
        </Link>

        <div className="mt-2 border-b border-stone-200 pb-4 dark:border-stone-800">
          <h1 className="font-serif text-2xl font-semibold text-stone-900 dark:text-white">{subject.name}</h1>
          {subject.guideName && <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{subject.guideName}</p>}
        </div>

        <section className="mt-8">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.14em] text-accent-600 dark:text-accent-400">
            Tasks & Assignments
          </p>
          {sortedTasks.length === 0 ? (
            <p className="py-4 text-sm text-stone-400">Nothing assigned yet.</p>
          ) : (
            <div className="divide-y divide-stone-200 dark:divide-stone-800">
              {sortedTasks.map((t) => (
                <TaskRow
                  key={t.id}
                  id={t.id}
                  subjectId={subject.id}
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

        <section className="mt-10">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-stone-400 dark:text-stone-500">
            Course Content
          </p>
          {subject.materials.length === 0 ? (
            <p className="py-4 text-sm text-stone-400">Nothing uploaded yet.</p>
          ) : (
            <MaterialFilterList materials={subject.materials} />
          )}
        </section>
      </main>
    </div>
  );
}
