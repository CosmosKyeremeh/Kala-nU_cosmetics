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
        className="text-sm font-medium text-charcoal hover:text-rose-primary"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <Link href="/profile" className="font-medium text-charcoal hover:text-rose-primary">
        Hi, {user.name?.split(" ")[0]}
      </Link>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="text-slate hover:text-rose-primary"
      >
        Sign out
      </button>
    </div>
  );
}
