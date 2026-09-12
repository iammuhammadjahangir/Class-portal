import Link from "next/link";
import SignOutButton from "./SignOutButton";

export default function TopNav({
  name,
  isAdmin,
}: {
  name: string;
  isAdmin: boolean;
}) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <div className="flex items-baseline gap-2">
          <Link href={isAdmin ? "/admin" : "/dashboard"} className="text-sm font-semibold text-slate-900 dark:text-white">
            MSCS Weekend · Fall 26
          </Link>
          {isAdmin && (
            <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white dark:bg-white dark:text-slate-900">
              CR
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              href="/dashboard"
              className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
            >
              Student view
            </Link>
          )}
          <span className="hidden text-xs text-slate-500 sm:inline dark:text-slate-400">{name}</span>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
