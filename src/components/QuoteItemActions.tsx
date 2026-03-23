"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiEdit2, FiLoader, FiTrash2, FiX } from "react-icons/fi";
import { createPortal } from "react-dom";

type Quote = {
  id: string;
  name: string;
  email: string;
  book: string;
  text: string;
};

type Props = {
  quote: Quote;
  rtl: boolean;
};

export default function QuoteItemActions({ quote, rtl }: Props) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({ name: quote.name, email: quote.email, book: quote.book, text: quote.text });
  const [dirty, setDirty] = useState({ name: false, email: false, book: false, text: false });
  const portalTarget = typeof document !== "undefined" ? document.body : null;

  useEffect(() => {
    if (!editOpen) return;
    setForm({ name: quote.name, email: quote.email, book: quote.book, text: quote.text });
    setDirty({ name: false, email: false, book: false, text: false });
  }, [editOpen, quote.book, quote.email, quote.name, quote.text]);

  const nameVal = form.name.trim();
  const emailVal = form.email.trim();
  const bookVal = form.book.trim();
  const textVal = form.text.trim();

  const emailRe = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);
  const nameValid = nameVal.length >= 2 && nameVal.length <= 80;
  const emailValid = emailRe.test(emailVal);
  const bookValid = bookVal.length >= 2 && bookVal.length <= 160;
  const textValid = textVal.length >= 3 && textVal.length <= 1200;
  const valid = nameValid && emailValid && bookValid && textValid;

  async function onDeleteConfirmed() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/quotes?id=${encodeURIComponent(quote.id)}`, { method: "DELETE" });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !data?.ok) {
        window.dispatchEvent(
          new CustomEvent("app:toast", {
            detail: { variant: "error", message: data?.error || `Request failed (${res.status})` },
          })
        );
        return;
      }
      window.dispatchEvent(new CustomEvent("app:toast", { detail: { variant: "success", message: "تم الحذف بنجاح" } }));
      setConfirmOpen(false);
      router.refresh();
    } catch {
      window.dispatchEvent(
        new CustomEvent("app:toast", { detail: { variant: "error", message: "تعذر الاتصال بالخادم" } })
      );
    } finally {
      setDeleting(false);
    }
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setDirty({ name: true, email: true, book: true, text: true });
    if (!valid) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/quotes?id=${encodeURIComponent(quote.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameVal, email: emailVal, book: bookVal, text: textVal }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !data?.ok) {
        window.dispatchEvent(
          new CustomEvent("app:toast", {
            detail: { variant: "error", message: data?.error || `Request failed (${res.status})` },
          })
        );
        return;
      }
      window.dispatchEvent(new CustomEvent("app:toast", { detail: { variant: "success", message: "تم التعديل بنجاح" } }));
      setEditOpen(false);
      router.refresh();
    } catch {
      window.dispatchEvent(
        new CustomEvent("app:toast", { detail: { variant: "error", message: "تعذر الاتصال بالخادم" } })
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          className="inline-flex items-center justify-center cursor-pointer rounded-md border border-zinc-200/60 dark:border-zinc-800/60 px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900"
          title={rtl ? "تعديل" : "Edit"}
          aria-label={rtl ? "تعديل" : "Edit"}
        >
          <FiEdit2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          disabled={deleting}
          className="inline-flex items-center justify-center cursor-pointer disabled:cursor-not-allowed rounded-md border border-zinc-200/60 dark:border-zinc-800/60 px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-60"
          title={rtl ? "حذف" : "Delete"}
          aria-label={rtl ? "حذف" : "Delete"}
        >
          {deleting ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiTrash2 className="h-4 w-4" />}
        </button>
      </div>

      {confirmOpen
        ? portalTarget
          ? createPortal(
              <div className="fixed inset-0 z-[200]" role="dialog" aria-modal="true">
                <div
                  className="absolute inset-0 bg-black/60"
                  onClick={() => (!deleting ? setConfirmOpen(false) : null)}
                />
                <div
                  dir={rtl ? "rtl" : "ltr"}
                  className="absolute left-1/2 top-1/2 w-[min(92vw,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-background p-5 shadow-xl"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="font-semibold">{rtl ? "تأكيد الحذف" : "Confirm delete"}</div>
                    <button
                      type="button"
                      onClick={() => setConfirmOpen(false)}
                      disabled={deleting}
                      className="inline-flex items-center justify-center cursor-pointer disabled:cursor-not-allowed rounded-md border border-zinc-200/60 dark:border-zinc-800/60 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-60"
                      aria-label={rtl ? "إغلاق" : "Close"}
                      title={rtl ? "إغلاق" : "Close"}
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                    {rtl
                      ? "هل تريد حذف هذا الاقتباس؟ لا يمكن التراجع."
                      : "Delete this quote? This action cannot be undone."}
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmOpen(false)}
                      disabled={deleting}
                      className="inline-flex items-center justify-center cursor-pointer disabled:cursor-not-allowed rounded-md border border-zinc-200/60 dark:border-zinc-800/60 px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-60"
                    >
                      {rtl ? "إلغاء" : "Cancel"}
                    </button>
                    <button
                      type="button"
                      onClick={onDeleteConfirmed}
                      disabled={deleting}
                      className="inline-flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed rounded-md px-4 py-2 bg-zinc-900 text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-black text-sm"
                    >
                      {deleting ? <FiLoader className="h-4 w-4 animate-spin" /> : null}
                      {deleting ? (rtl ? "جارٍ الحذف..." : "Deleting...") : rtl ? "حذف" : "Delete"}
                    </button>
                  </div>
                </div>
              </div>,
              portalTarget
            )
          : null
        : null}

      {editOpen
        ? portalTarget
          ? createPortal(
              <div className="fixed inset-0 z-[201]" role="dialog" aria-modal="true">
                <div className="absolute inset-0 bg-black/60" onClick={() => (!saving ? setEditOpen(false) : null)} />
                <div className="absolute left-1/2 top-1/2 w-[min(92vw,36rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-background p-5 shadow-xl">
                  <div className="flex items-center justify-between gap-4">
                    <div className="font-semibold">{rtl ? "تعديل الاقتباس" : "Edit Quote"}</div>
                    <button
                      type="button"
                      onClick={() => setEditOpen(false)}
                      disabled={saving}
                      className="inline-flex items-center justify-center cursor-pointer disabled:cursor-not-allowed rounded-md border border-zinc-200/60 dark:border-zinc-800/60 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-60"
                      aria-label={rtl ? "إغلاق" : "Close"}
                      title={rtl ? "إغلاق" : "Close"}
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>

                  <form onSubmit={onSave} className="mt-4 grid gap-3" dir={rtl ? "rtl" : "ltr"}>
                    <div>
                      <label className="block text-sm font-medium mb-1">{rtl ? "الاسم" : "Name"}</label>
                      <input
                        value={form.name}
                        onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
                        onBlur={() => setDirty((v) => ({ ...v, name: true }))}
                        className="w-full rounded-md border border-zinc-200/60 dark:border-zinc-800/60 bg-background px-3 py-2"
                      />
                      {dirty.name && !nameValid ? (
                        <p className="mt-1 text-sm text-red-600">
                          {rtl ? "الاسم يجب أن يكون 2–80 حرف" : "Name must be 2–80 characters"}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">{rtl ? "البريد الإلكترونى" : "Email"}</label>
                      <input
                        value={form.email}
                        onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))}
                        onBlur={() => setDirty((v) => ({ ...v, email: true }))}
                        className="w-full rounded-md border border-zinc-200/60 dark:border-zinc-800/60 bg-background px-3 py-2"
                      />
                      {dirty.email && !emailValid ? (
                        <p className="mt-1 text-sm text-red-600">{rtl ? "بريد غير صالح" : "Invalid email"}</p>
                      ) : null}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">{rtl ? "اسم الكتاب" : "Book Title"}</label>
                      <input
                        value={form.book}
                        onChange={(e) => setForm((v) => ({ ...v, book: e.target.value }))}
                        onBlur={() => setDirty((v) => ({ ...v, book: true }))}
                        className="w-full rounded-md border border-zinc-200/60 dark:border-zinc-800/60 bg-background px-3 py-2"
                      />
                      {dirty.book && !bookValid ? (
                        <p className="mt-1 text-sm text-red-600">
                          {rtl ? "اسم الكتاب يجب أن يكون 2–160 حرف" : "Book title must be 2–160 characters"}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">{rtl ? "الاقتباس" : "Quote"}</label>
                      <textarea
                        value={form.text}
                        onChange={(e) => setForm((v) => ({ ...v, text: e.target.value }))}
                        onBlur={() => setDirty((v) => ({ ...v, text: true }))}
                        className={
                          "w-full min-h-28 rounded-md border border-zinc-200/60 dark:border-zinc-800/60 bg-background px-3 py-2 " +
                          (rtl ? "text-right" : "text-left")
                        }
                      />
                      {dirty.text && !textValid ? (
                        <p className="mt-1 text-sm text-red-600">
                          {rtl ? "الاقتباس يجب أن يكون 3–1200 حرف" : "Quote must be 3–1200 characters"}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setEditOpen(false)}
                        disabled={saving}
                        className="inline-flex items-center justify-center cursor-pointer disabled:cursor-not-allowed rounded-md border border-zinc-200/60 dark:border-zinc-800/60 px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-60"
                      >
                        {rtl ? "إلغاء" : "Cancel"}
                      </button>
                      <button
                        type="submit"
                        disabled={!valid || saving}
                        className="inline-flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed rounded-md px-4 py-2 bg-zinc-900 text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-black text-sm"
                      >
                        {saving ? <FiLoader className="h-4 w-4 animate-spin" /> : null}
                        {saving ? (rtl ? "جارٍ الحفظ..." : "Saving...") : rtl ? "حفظ" : "Save"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>,
              portalTarget
            )
          : null
        : null}
    </>
  );
}
