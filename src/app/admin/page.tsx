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

      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-8 flex items-end justify-between border-b border-stone-200 pb-4 dark:border-stone-800">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-accent-600 dark:text-accent-400">
              Semester 1 · Fall 2026
            </p>
            <h1 className="mt-1 font-serif text-2xl font-semibold text-stone-900 dark:text-white">Subjects</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-stone-500 dark:text-stone-400">{studentCount} on the roster</p>
            <Link href="/admin/roster" className="text-xs font-medium text-accent-600 hover:underline dark:text-accent-400">
              Manage roster
            </Link>
          </div>
        </div>

        <div className="divide-y divide-stone-200 dark:divide-stone-800">
          {subjects.map((s, i) => (
            <div key={s.id} className="group flex items-center gap-4 py-4">
              <span className="w-6 shrink-0 font-mono text-sm text-stone-300 dark:text-stone-700">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Link href={`/admin/subjects/${s.id}`} className="min-w-0 flex-1">
                <p className="font-serif text-lg text-stone-900 group-hover:text-accent-700 dark:text-white dark:group-hover:text-accent-400">
                  {s.name}
                </p>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  {s.guideName}
                  {s.guideName && " · "}
                  {s._count.materials} materials, {s._count.tasks} tasks
                </p>
              </Link>
              <DeleteButton action={deleteSubject.bind(null, s.id)} confirmText="Delete subject and everything in it?" />
            </div>
          ))}
        </div>

        <div className="mt-6">
          <NewSubjectForm />
        </div>
      </main>
    </div>
  );
}
