import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import TopNav from "@/components/TopNav";
import NewSubjectForm from "@/components/admin/NewSubjectForm";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteSubject } from "@/lib/actions";

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

      <main className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Subjects</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{studentCount} students on the roster</p>
          </div>
          <Link
            href="/admin/roster"
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Manage roster
          </Link>
        </div>

        <div className="space-y-3">
          {subjects.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <Link href={`/admin/subjects/${s.id}`} className="min-w-0 flex-1">
                <p className="font-medium text-slate-900 dark:text-white">{s.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {s.guideName ? `${s.guideName} · ` : ""}
                  {s._count.materials} materials · {s._count.tasks} tasks
                </p>
              </Link>
              <DeleteButton action={deleteSubject.bind(null, s.id)} confirmText="Delete subject and everything in it?" />
            </div>
          ))}

          <NewSubjectForm />
        </div>
      </main>
    </div>
  );
}
