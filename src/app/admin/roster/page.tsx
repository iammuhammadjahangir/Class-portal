import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import TopNav from "@/components/TopNav";
import AddStudentForm from "@/components/admin/AddStudentForm";
import DeleteButton from "@/components/admin/DeleteButton";
import { removeStudent, resetStudentPassword } from "@/lib/actions";

export default async function RosterPage() {
  const session = await auth();
  if (!session?.user?.isAdmin) redirect(session?.user ? "/dashboard" : "/login");
  const students = await prisma.student.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="min-h-dvh">
      <TopNav name={session.user.name ?? ""} isAdmin />

      <main className="mx-auto max-w-3xl px-4 py-6">
        <Link href="/admin" className="text-xs font-medium text-stone-400 hover:text-stone-700 dark:hover:text-stone-200">
          ← Subjects
        </Link>
        <h1 className="mt-1 mb-1 text-xl font-semibold text-stone-900 dark:text-white">Class roster</h1>
        <p className="mb-4 text-sm text-stone-500 dark:text-stone-400">
          Add every classmate here. They&apos;ll set their own password the first time they log in with their roll
          number.
        </p>

        <AddStudentForm />

        <div className="mt-4 divide-y divide-stone-200 overflow-hidden rounded-xl border border-stone-200 dark:divide-stone-800 dark:border-stone-800">
          {students.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-3 bg-white px-4 py-3 dark:bg-stone-900">
              <div className="min-w-0">
                <p className="font-medium text-stone-900 dark:text-white">
                  {s.name}
                  {s.isAdmin && (
                    <span className="ml-2 rounded-full bg-accent-600 px-2 py-0.5 text-[10px] font-medium uppercase text-white dark:bg-accent-500">
                      CR
                    </span>
                  )}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {s.rollNumber} · {s.passwordHash ? "Account set up" : "Not claimed yet"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {s.passwordHash && (
                  <form action={async () => { "use server"; await resetStudentPassword(s.id); }}>
                    <button className="text-xs font-medium text-stone-400 hover:text-stone-700 dark:hover:text-stone-200">
                      Reset password
                    </button>
                  </form>
                )}
                {!s.isAdmin && <DeleteButton action={removeStudent.bind(null, s.id)} confirmText="Remove from roster?" />}
              </div>
            </div>
          ))}
          {students.length === 0 && (
            <p className="bg-white p-6 text-center text-sm text-stone-400 dark:bg-stone-900">No students yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}
