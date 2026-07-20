"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

type Props = {
  user: { name?: string | null; role?: string } | null;
};

export function NavUserMenu({ user }: Props) {
  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="whitespace-nowrap text-sm font-medium text-charcoal transition-colors duration-300 ease-out hover:text-rose-primary"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-sm">
      <Link
        href="/profile"
        className="whitespace-nowrap font-medium text-charcoal transition-colors duration-300 ease-out hover:text-rose-primary"
      >
        {user.name?.split(" ")[0]}
      </Link>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        aria-label="Sign out"
        title="Sign out"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate transition-colors duration-300 ease-out hover:bg-rose-light/20 hover:text-rose-primary"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path
            d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
