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
    <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/80 backdrop-blur dark:border-stone-800 dark:bg-stone-950/80">
      <div className="h-1 bg-gradient-to-r from-accent-600 via-accent-400 to-accent-600" />
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-600 text-xs font-bold text-white dark:bg-accent-500">
            AU
          </span>
          <div className="flex items-baseline gap-2">
            <Link href={isAdmin ? "/admin" : "/dashboard"} className="text-sm font-semibold text-stone-900 dark:text-white">
              MSCS Weekend · Fall 26
            </Link>
            {isAdmin && (
              <span className="rounded-full bg-accent-600 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white dark:bg-accent-500">
                CR
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              href="/dashboard"
              className="text-xs font-medium text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-white"
            >
              Student view
            </Link>
          )}
          <span className="hidden text-xs text-stone-500 sm:inline dark:text-stone-400">{name}</span>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
