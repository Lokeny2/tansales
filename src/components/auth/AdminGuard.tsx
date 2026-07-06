"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  // Still checking the badge with the server — show a neutral waiting
  // state rather than briefly flashing the real admin content.
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-500 font-mono text-xs uppercase tracking-widest">
        Verifying access...
      </div>
    );
  }

  // No valid session, or a session that isn't an admin — turn them away.
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
        <h1 className="text-2xl font-bold text-white">Restricted Area</h1>
        <p className="text-sm text-neutral-400 max-w-sm">
          You need an administrator account to view this page.
        </p>
        <Link
          href="/auth"
          className="text-xs uppercase tracking-widest text-accent-lime underline"
        >
          Sign in
        </Link>
      </div>
    );
  }

  // Passed both checks — let them see the real content.
  return <>{children}</>;
}
