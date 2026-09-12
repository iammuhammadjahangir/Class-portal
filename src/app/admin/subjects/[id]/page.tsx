import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import TopNav from "@/components/TopNav";
import NewMaterialForm from "@/components/admin/NewMaterialForm";
import NewTaskForm from "@/components/admin/NewTaskForm";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteMaterial, deleteTask } from "@/lib/actions";
import { dueDateLabel } from "@/lib/dates";

const TYPE_LABEL: Record<string, string> = {
  ASSIGNMENT: "Assignment",
  QUIZ: "Quiz",
  TASK: "Task",
};

export default async function SubjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.isAdmin) redirect(session?.user ? "/dashboard" : "/login");
  const subject = await prisma.subject.findUnique({
    where: { id },
    include: {
      materials: { orderBy: { createdAt: "desc" } },
      tasks: { orderBy: { dueDate: "asc" } },
    },
  });
  if (!subject) notFound();

  return (
    <div className="min-h-dvh">
      <TopNav name={session.user.name ?? ""} isAdmin />

      <main className="mx-auto max-w-3xl px-4 py-6">
        <Link href="/admin" className="text-xs font-medium text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
          ← All subjects
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{subject.name}</h1>
        {subject.guideName && <p className="text-sm text-slate-500 dark:text-slate-400">Guide: {subject.guideName}</p>}

        <section className="mt-8">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-500">
            Assignments, quizzes & tasks
          </h2>
          <div className="space-y-2">
            {subject.tasks.map((t) => (
              <div
                key={t.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="rounded-full bg-slate-900 px-2 py-0.5 font-medium text-white dark:bg-white dark:text-slate-900">
                      {TYPE_LABEL[t.type]}
                    </span>
                    <span className="text-slate-400">{dueDateLabel(t.dueDate).text}</span>
                  </div>
                  <p className="mt-1 font-medium text-slate-900 dark:text-white">{t.title}</p>
                  {t.description && <p className="text-sm text-slate-500 dark:text-slate-400">{t.description}</p>}
                </div>
                <DeleteButton action={deleteTask.bind(null, t.id, subject.id)} />
              </div>
            ))}
            <NewTaskForm subjectId={subject.id} />
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Course content & slides
          </h2>
          <div className="space-y-2">
            {subject.materials.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 dark:text-white">{m.title}</p>
                  {m.description && <p className="text-sm text-slate-500 dark:text-slate-400">{m.description}</p>}
                </div>
                <DeleteButton action={deleteMaterial.bind(null, m.id, subject.id)} />
              </div>
            ))}
            <NewMaterialForm subjectId={subject.id} />
          </div>
        </section>
      </main>
    </div>
  );
}
