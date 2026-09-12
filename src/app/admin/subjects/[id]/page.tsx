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
import { MATERIAL_TAG_META } from "@/lib/materialTags";
import { TASK_TYPE_META } from "@/lib/taskTypes";

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

      <main className="mx-auto max-w-2xl px-4 py-10">
        <Link href="/admin" className="text-xs font-medium text-stone-400 hover:text-stone-700 dark:hover:text-stone-200">
          ← All subjects
        </Link>

        <div className="mt-2 border-b border-stone-200 pb-4 dark:border-stone-800">
          <h1 className="font-serif text-2xl font-semibold text-stone-900 dark:text-white">{subject.name}</h1>
          {subject.guideName && <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{subject.guideName}</p>}
        </div>

        <section className="mt-8">
          <h2 className="mb-1 text-[11px] font-medium uppercase tracking-[0.14em] text-accent-600 dark:text-accent-400">
            Assignments, quizzes & tasks
          </h2>
          <div className="divide-y divide-stone-200 dark:divide-stone-800">
            {subject.tasks.map((t) => (
              <div key={t.id} className="flex items-start justify-between gap-3 py-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${TASK_TYPE_META[t.type].chip}`}>
                      {TASK_TYPE_META[t.type].label}
                    </span>
                    <p className="font-medium text-stone-900 dark:text-white">{t.title}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-stone-500 dark:text-stone-400">{dueDateLabel(t.dueDate).text}</p>
                  {t.description && <p className="mt-0.5 text-sm text-stone-500 dark:text-stone-400">{t.description}</p>}
                </div>
                <DeleteButton action={deleteTask.bind(null, t.id, subject.id)} />
              </div>
            ))}
          </div>
          <div className="mt-3">
            <NewTaskForm subjectId={subject.id} />
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-1 text-[11px] font-medium uppercase tracking-[0.14em] text-stone-400 dark:text-stone-500">
            Course content & slides
          </h2>
          <div className="divide-y divide-stone-200 dark:divide-stone-800">
            {subject.materials.map((m) => (
              <div key={m.id} className="flex items-start justify-between gap-3 py-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-stone-900 dark:text-white">{m.title}</p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${MATERIAL_TAG_META[m.tag].active}`}>
                      {MATERIAL_TAG_META[m.tag].label}
                    </span>
                  </div>
                  {m.description && <p className="text-sm text-stone-500 dark:text-stone-400">{m.description}</p>}
                </div>
                <DeleteButton action={deleteMaterial.bind(null, m.id, subject.id)} />
              </div>
            ))}
          </div>
          <div className="mt-3">
            <NewMaterialForm subjectId={subject.id} />
          </div>
        </section>
      </main>
    </div>
  );
}
