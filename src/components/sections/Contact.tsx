"use client";

import { FiMail, FiGithub, FiLinkedin, FiLoader, FiCheck, FiAlertTriangle } from "react-icons/fi";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<null | boolean>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "", company: "" });
  const [dirty, setDirty] = useState({ name: false, email: false, message: false });

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameMin = 2;
  const nameMax = 80;
  const msgMin = 10;
  const msgMax = 2000;

  const nameVal = form.name.trim();
  const emailVal = form.email.trim();
  const msgVal = form.message.trim();

  const nameTooShort = nameVal.length < nameMin;
  const nameTooLong = nameVal.length > nameMax;
  const nameValid = !nameTooShort && !nameTooLong;
  const emailValid = emailRe.test(emailVal);
  const msgTooShort = msgVal.length < msgMin;
  const msgTooLong = msgVal.length > msgMax;
  const msgValid = !msgTooShort && !msgTooLong;

  const valid = nameValid && emailValid && msgValid;
  const handleCloseSuccess = () => {
    setOk(null);
    setDirty({ name: false, email: false, message: false });
  };
  return (
    <section id="contact" className="py-16 scroll-mt-24 lg:scroll-mt-28">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <FiMail className="h-6 w-6" />
          <h2 className="text-2xl font-bold underline">Contact Us</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 p-6 bg-white/50 dark:bg-black/30">
            <h3 className="font-bold mb-2 underline">Contact Info</h3>
            <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
              <li>
                Email:{" "}
                <a className="underline" href="mailto:m.elzero33@gmail.com">
                  m.elzero33@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 pt-2">
                <a
                  href="https://github.com/mhmd309"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-zinc-200/60 dark:border-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  <FiGithub className="h-5 w-5" /> Github
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-zinc-200/60 dark:border-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  <FiLinkedin className="h-5 w-5" /> LinkedIn
                </a>
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 p-6 bg-white/50 dark:bg-black/30">
            <h3 className="font-bold mb-2 underline">Send a Message</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!valid) return;
                setLoading(true);
                setOk(null);
                setError(null);
                try {
                  const controller = new AbortController();
                  const to = setTimeout(() => controller.abort(), 25000);
                  const res = await fetch("/api/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name: form.name,
                      email: form.email,
                      message: form.message,
                      company: form.company,
                    }),
                    signal: controller.signal,
                  });
                  clearTimeout(to);
                  const data = await res.json();
                  if (res.ok && data.ok) {
                    setOk(true);
                    setDirty({ name: false, email: false, message: false });
                    setForm({ name: "", email: "", message: "", company: "" });
                  } else {
                    setOk(false);
                    setError(data.error || "Failed to send");
                  }
                } catch (err: unknown) {
                  setOk(false);
                  const msg = err instanceof Error ? err.message : "Network error";
                  setError(msg === "The user aborted a request." ? "انتهت مهلة الاتصال بالخادم" : "Network error");
                } finally {
                  setLoading(false);
                }
              }}
              className="space-y-3"
            >
              <label htmlFor="contact-name" className="block text-sm font-medium mb-0">
              Name:
              </label>
              <input
                id="contact-name"
                type="text"
                placeholder="Name"
                autoComplete="off"
                value={form.name}
                onChange={(e) => {
                  setDirty((d) => ({ ...d, name: true }));
                  setForm((f) => ({ ...f, name: e.target.value }));
                }}
                maxLength={nameMax + 10}
                aria-invalid={dirty.name && !nameValid && !ok}
                className={clsx(
                  "mt-0 w-full rounded-md bg-transparent px-3 py-2 focus:outline-none",
                  dirty.name && !nameValid && !ok
                    ? "border border-red-600 dark:border-red-500"
                    : "border border-zinc-300 dark:border-zinc-700"
                )}
                required
              />
              {dirty.name && !nameValid && !ok ? (
                <p className="text-sm text-red-600" aria-live="polite">
                  {nameTooShort
                    ? `ناقص ${nameMin - nameVal.length} حرف`
                    : `تجاوزت الحد الأقصى ${nameMax} حرفًا`}
                </p>
              ) : null}
              <label htmlFor="contact-email" className="block text-sm font-medium mb-0">
               Email:
              </label>
              <input
                id="contact-email"
                type="email"
                placeholder="Email"
                autoComplete="off"
                value={form.email}
                onChange={(e) => {
                  setDirty((d) => ({ ...d, email: true }));
                  setForm((f) => ({ ...f, email: e.target.value }));
                }}
                aria-invalid={dirty.email && !emailValid && !ok}
                className={clsx(
                  "mt-0 w-full rounded-md bg-transparent px-3 py-2 focus:outline-none",
                  dirty.email && !emailValid && !ok
                    ? "border border-red-600 dark:border-red-500"
                    : "border border-zinc-300 dark:border-zinc-700"
                )}
                required
              />
              {dirty.email && !emailValid && !ok ? (
                <p className="text-sm text-red-600" aria-live="polite">
                  صيغة البريد الإلكتروني غير صحيحة
                </p>
              ) : null}
              <label htmlFor="contact-message" className="block text-sm font-medium mb-0">
                Message:
              </label>
              <textarea
                id="contact-message"
                placeholder="Message"
                autoComplete="off"
                value={form.message}
                onChange={(e) => {
                  setDirty((d) => ({ ...d, message: true }));
                  setForm((f) => ({ ...f, message: e.target.value }));
                }}
                maxLength={msgMax + 50}
                aria-invalid={dirty.message && !msgValid && !ok}
                className={clsx(
                  "m-0 w-full rounded-md bg-transparent px-3 py-2 h-28 focus:outline-none resize-none",
                  dirty.message && !msgValid && !ok
                    ? "border border-red-600 dark:border-red-500"
                    : "border border-zinc-300 dark:border-zinc-700"
                )}
                required
              />
              <div className="text-end mt-0 mb-0">
                {dirty.message && !msgValid && !ok ? (
                  <p className="mt-0 text-sm text-red-600" aria-live="polite">
                    {msgTooShort
                      ? `ناقص ${msgMin - msgVal.length} حرف`
                      : `تجاوزت الحد الأقصى ${msgMax} حرفًا`}
                  </p>
                ) : <span />}
                <span className="text-xs text-zinc-500">
                  {msgVal.length}/{msgMax}
                </span>
              </div>
              {/* Honeypot field (hidden) */}
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              <button
                type="submit"
                disabled={!valid || loading}
                className="mt-1 w-full inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-black dark:hover:bg-white transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? <FiLoader className="h-4 w-4 animate-spin" /> : null}
                {loading ? "Sending..." : "Send"}
              </button>
              {ok === false && (
                <p className="flex items-center gap-2 text-red-600">
                  <FiAlertTriangle className="h-4 w-4" /> {error}
                </p>
              )}
            </form>
            <AnimatePresence>
              {ok && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[70]"
                  aria-hidden={false}
                >
                  <div
                    className="absolute inset-0 bg-black/60"
                    onClick={handleCloseSuccess}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: 8 }}
                    transition={{ duration: 0.2 }}
                    role="dialog"
                    aria-modal="true"
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90vw,28rem)] rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-background p-6 shadow-xl"
                  >
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-600/15 text-green-600">
                        <FiCheck className="h-7 w-7" />
                      </div>
                      <h3 className="font-semibold text-base">Message Sent</h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-300">
                        Thank you for reaching out. Your message has been sent successfully and I&apos;ll get back to you as soon as possible.
                      </p>
                      <button
                        onClick={handleCloseSuccess}
                        className="mt-1 inline-flex items-center justify-center rounded-md px-4 py-2 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-black dark:hover:bg-white transition-colors cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
