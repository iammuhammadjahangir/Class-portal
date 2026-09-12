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

      <main className="mx-auto max-w-2xl px-4 py-10">
        <Link href="/admin" className="text-xs font-medium text-stone-400 hover:text-stone-700 dark:hover:text-stone-200">
          ← Subjects
        </Link>
        <div className="mt-2 border-b border-stone-200 pb-4 dark:border-stone-800">
          <h1 className="font-serif text-2xl font-semibold text-stone-900 dark:text-white">Class roster</h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Add every classmate here. They&apos;ll set their own password the first time they log in with their roll
            number.
          </p>
        </div>

        <div className="mt-6">
          <AddStudentForm />
        </div>

        <div className="mt-6 divide-y divide-stone-200 dark:divide-stone-800">
          {students.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="font-medium text-stone-900 dark:text-white">
                  {s.name}
                  {s.isAdmin && <span className="ml-1.5 text-xs text-accent-600 dark:text-accent-400">· CR</span>}
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
          {students.length === 0 && <p className="py-6 text-sm text-stone-400">No students yet.</p>}
        </div>
      </main>
    </div>
  );
}
