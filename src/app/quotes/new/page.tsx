"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type FormState = {
  name: string;
  email: string;
  book: string;
  text: string;
};

export default function NewQuotePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<null | boolean>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ name: "", email: "", book: "", text: "" });
  const [dirty, setDirty] = useState({ name: false, email: false, book: false, text: false });

  const nameVal = form.name.trim();
  const emailVal = form.email.trim();
  const bookVal = form.book.trim();
  const textVal = form.text.trim();

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const nameValid = nameVal.length >= 2 && nameVal.length <= 80;
  const emailValid = emailRe.test(emailVal);
  const bookValid = bookVal.length >= 2 && bookVal.length <= 160;
  const textValid = textVal.length >= 3 && textVal.length <= 1200;

  const valid = nameValid && emailValid && bookValid && textValid;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setDirty({ name: true, email: true, book: true, text: true });
    setOk(null);
    setError(null);
    if (!valid) return;
    setLoading(true);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameVal, email: emailVal, book: bookVal, text: textVal }),
      });
      let data: { ok?: boolean; error?: string } | null = null;
      try {
        data = (await res.json()) as { ok?: boolean; error?: string };
      } catch {
        data = null;
      }
      if (!res.ok || !data?.ok) {
        setOk(false);
        setError(data?.error || `Request failed (${res.status})`);
        return;
      }
      setOk(true);
      setForm({ name: "", email: "", book: "", text: "" });
      setDirty({ name: false, email: false, book: false, text: false });
      router.push(`/quotes?ts=${Date.now()}`);
    } catch {
      setOk(false);
      setError("Could not reach the server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Add Quote</h1>
          <Link className="underline text-sm" href="/quotes">
            View Quotes
          </Link>
        </div>

        <div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 p-6 bg-white/50 dark:bg-black/30">
          <form onSubmit={onSubmit} className="grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Your Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
                onBlur={() => setDirty((v) => ({ ...v, name: true }))}
                className="w-full rounded-md border border-zinc-200/60 dark:border-zinc-800/60 bg-background px-3 py-2"
                placeholder="e.g. Ahmed"
              />
              {dirty.name && !nameValid ? (
                <p className="mt-1 text-sm text-red-600">Name must be 2–80 characters</p>
              ) : null}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Your Email</label>
              <input
                value={form.email}
                onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))}
                onBlur={() => setDirty((v) => ({ ...v, email: true }))}
                className="w-full rounded-md border border-zinc-200/60 dark:border-zinc-800/60 bg-background px-3 py-2"
                placeholder="name@example.com"
              />
              {dirty.email && !emailValid ? <p className="mt-1 text-sm text-red-600">Invalid email</p> : null}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Book Title</label>
              <input
                value={form.book}
                onChange={(e) => setForm((v) => ({ ...v, book: e.target.value }))}
                onBlur={() => setDirty((v) => ({ ...v, book: true }))}
                className="w-full rounded-md border border-zinc-200/60 dark:border-zinc-800/60 bg-background px-3 py-2"
                placeholder="e.g. Atomic Habits"
              />
              {dirty.book && !bookValid ? (
                <p className="mt-1 text-sm text-red-600">Book title must be 2–160 characters</p>
              ) : null}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Quote</label>
              <textarea
                value={form.text}
                onChange={(e) => setForm((v) => ({ ...v, text: e.target.value }))}
                onBlur={() => setDirty((v) => ({ ...v, text: true }))}
                className="w-full min-h-32 rounded-md border border-zinc-200/60 dark:border-zinc-800/60 bg-background px-3 py-2"
                placeholder="Write the quote here..."
              />
              {dirty.text && !textValid ? (
                <p className="mt-1 text-sm text-red-600">Quote must be 3–1200 characters</p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                disabled={loading}
                type="submit"
                className="inline-flex items-center justify-center cursor-pointer disabled:cursor-not-allowed rounded-md px-4 py-2 bg-zinc-900 text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-black"
              >
                {loading ? "Publishing..." : "Publish"}
              </button>

              {ok === true ? <span className="text-sm text-green-700">Published successfully</span> : null}
              {ok === false ? <span className="text-sm text-red-600">{error || "Something went wrong"}</span> : null}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
