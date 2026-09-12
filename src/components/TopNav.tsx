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
    <header className="border-b border-stone-200 dark:border-stone-800">
      <div className="mx-auto flex max-w-3xl items-baseline justify-between px-4 py-4">
        <Link href={isAdmin ? "/admin" : "/dashboard"} className="leading-tight">
          <p className="font-serif text-lg font-semibold text-stone-900 dark:text-white">MSCS Weekend</p>
          <p className="text-[11px] uppercase tracking-[0.14em] text-stone-400 dark:text-stone-500">
            Air University · Fall 2026
          </p>
        </Link>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link
              href="/dashboard"
              className="text-xs font-medium text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-white"
            >
              Student view
            </Link>
          )}
          <span className="hidden text-xs text-stone-500 sm:inline dark:text-stone-400">
            {name}
            {isAdmin && <span className="ml-1.5 text-accent-600 dark:text-accent-400">· CR</span>}
          </span>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
