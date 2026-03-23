"use client";

import { useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";

type Props = {
  text: string;
  locale?: "en" | "ar";
};

export default function QuoteCopyButton({ text, locale = "en" }: Props) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={
        copied
          ? locale === "ar"
            ? "تم النسخ"
            : "Copied"
          : locale === "ar"
            ? "نسخ"
            : "Copy"
      }
      title={
        copied
          ? locale === "ar"
            ? "تم النسخ"
            : "Copied"
          : locale === "ar"
            ? "نسخ"
            : "Copy"
      }
      className="shrink-0 inline-flex items-center justify-center cursor-pointer rounded-md border border-zinc-200/60 dark:border-zinc-800/60 px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900"
    >
      {copied ? (
        <FiCheck className="h-4 w-4 text-green-600" />
      ) : (
        <FiCopy className="h-4 w-4" />
      )}
      <span className="sr-only">
        {copied ? (locale === "ar" ? "تم النسخ" : "Copied") : locale === "ar" ? "نسخ" : "Copy"}
      </span>
    </button>
  );
}
