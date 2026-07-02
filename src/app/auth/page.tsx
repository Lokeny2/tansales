"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user, signIn, signUp } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace("/products");
    }
  }, [router, user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const result =
      mode === "signin"
        ? await signIn(email, password)
        : await signUp(name, email, password);

    setMessage(result.message);
    setIsSubmitting(false);

    if (result.ok) {
      router.push("/products");
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-20 text-neutral-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 md:flex-row md:p-12">
        <div className="flex-1 space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-lime-400">
            Customer access
          </p>
          <h1 className="text-4xl font-semibold sm:text-5xl">
            Welcome back to Tanite.
          </h1>
          <p className="max-w-xl text-sm leading-7 text-neutral-400">
            Create an account to save your details and keep your orders
            organized in one private storefront experience.
          </p>
        </div>

        <div className="flex-1 rounded-2xl border border-white/10 bg-neutral-900/80 p-6">
          <div className="mb-6 flex gap-2 rounded-full border border-white/10 p-1">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`flex-1 rounded-full px-4 py-2 text-sm transition ${mode === "signin" ? "bg-lime-400 text-neutral-950" : "text-neutral-300"}`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-full px-4 py-2 text-sm transition ${mode === "signup" ? "bg-lime-400 text-neutral-950" : "text-neutral-300"}`}
            >
              Create account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-3 text-sm outline-none focus:border-lime-400"
                placeholder="Full name"
                required
              />
            )}
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-3 text-sm outline-none focus:border-lime-400"
              placeholder="Email address"
              type="email"
              required
            />
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-3 text-sm outline-none focus:border-lime-400"
              placeholder="Password"
              type="password"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-lime-400 px-4 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-lime-300 disabled:opacity-60"
            >
              {isSubmitting
                ? "Working..."
                : mode === "signin"
                  ? "Sign in"
                  : "Create account"}
            </button>
          </form>

          {message ? (
            <p className="mt-4 text-sm text-neutral-300">{message}</p>
          ) : null}

          <p className="mt-6 text-xs text-neutral-500">
            Looking for the catalog?{" "}
            <Link href="/products" className="text-lime-400">
              Browse products
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
