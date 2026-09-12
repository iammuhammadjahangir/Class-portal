import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import TopNav from "@/components/TopNav";
import NewSubjectForm from "@/components/admin/NewSubjectForm";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteSubject } from "@/lib/actions";
import { subjectColor } from "@/lib/subjectColor";

export default async function AdminHome() {
  const session = await auth();
  if (!session?.user?.isAdmin) redirect(session?.user ? "/dashboard" : "/login");
  const subjects = await prisma.subject.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { materials: true, tasks: true } } },
  });
  const studentCount = await prisma.student.count({ where: { isAdmin: false } });

  return (
    <div className="min-h-dvh">
      <TopNav name={session.user.name ?? ""} isAdmin />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-400">
              Semester 1 · Fall 2026
            </p>
            <h1 className="mt-0.5 text-lg font-semibold text-stone-900 dark:text-white">Subjects</h1>
            <p className="text-sm text-stone-500 dark:text-stone-400">{studentCount} students on the roster</p>
          </div>
          <Link
            href="/admin/roster"
            className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
          >
            Manage roster
          </Link>
        </div>

        <div className="space-y-3">
          {subjects.map((s) => {
            const color = subjectColor(s.order);
            return (
              <div
                key={s.id}
                className={`flex items-center justify-between rounded-xl border border-l-4 bg-white p-4 dark:bg-stone-900 ${color.border} border-stone-200 dark:border-stone-800`}
              >
                <Link href={`/admin/subjects/${s.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${color.chip}`}>
                    {s.name.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="min-w-0">
                    <p className="font-medium text-stone-900 dark:text-white">{s.name}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {s.guideName ? `${s.guideName} · ` : ""}
                      {s._count.materials} materials · {s._count.tasks} tasks
                    </p>
                  </span>
                </Link>
                <DeleteButton action={deleteSubject.bind(null, s.id)} confirmText="Delete subject and everything in it?" />
              </div>
            );
          })}

          <NewSubjectForm />
        </div>
      </main>
    </div>
  );
}
