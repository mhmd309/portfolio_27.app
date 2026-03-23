"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiBookOpen, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import QuoteCopyButton from "src/components/QuoteCopyButton";
import QuoteItemActions from "src/components/QuoteItemActions";

type Quote = {
  id: string;
  name: string;
  email: string;
  book: string;
  text: string;
  createdAt: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function isRtlText(text: string) {
  return /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(text);
}

type QuotesApiOk = {
  ok: true;
  page: number;
  pageSize: number;
  total: number;
  items: Quote[];
};

type QuotesApiErr = {
  ok: false;
  error: string;
};

type QuotesApiResponse = QuotesApiOk | QuotesApiErr;

const pageSize = 20;

function buildApiUrl(page: number, bookQuery: string) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));
  if (bookQuery.trim()) params.set("book", bookQuery.trim());
  return `/api/quotes?${params.toString()}`;
}

export default function QuotesPage() {
  const [bookQuery, setBookQuery] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<QuotesApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const initialBook = sp.get("book") || "";
    const initialPage = Math.max(1, Number(sp.get("page") || "1") || 1);
    setBookQuery(initialBook);
    setPage(initialPage);
    setReady(true);

    const onPop = () => {
      const next = new URLSearchParams(window.location.search);
      setBookQuery(next.get("book") || "");
      setPage(Math.max(1, Number(next.get("page") || "1") || 1));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const params = new URLSearchParams();
    if (bookQuery.trim()) params.set("book", bookQuery.trim());
    if (page !== 1) params.set("page", String(page));
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `/quotes?${qs}` : "/quotes");
  }, [ready, bookQuery, page]);

  useEffect(() => {
    if (!ready) return;

    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();

    setLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;
    debounceRef.current = window.setTimeout(async () => {
      try {
        const res = await fetch(buildApiUrl(page, bookQuery), { cache: "no-store", signal: controller.signal });
        const json = (await res.json().catch(() => null)) as QuotesApiResponse | null;
        if (!res.ok || !json) {
          setData({ ok: false, error: `HTTP_${res.status}` });
          return;
        }
        setData(json);
      } catch (err: unknown) {
        const e = err as { name?: unknown };
        if (e && e.name === "AbortError") return;
        setData({ ok: false, error: "FETCH_FAILED" });
      } finally {
        setLoading(false);
      }
    }, 120);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      controller.abort();
    };
  }, [ready, bookQuery, page]);

  const total = data && data.ok ? data.total : 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = clamp(page, 1, totalPages);
  const items = data && data.ok ? data.items : [];

  useEffect(() => {
    if (!ready) return;
    if (safePage !== page) setPage(safePage);
  }, [ready, page, safePage]);

  const pages = useMemo(() => {
    const startPage = Math.max(1, safePage - 2);
    const endPage = Math.min(totalPages, safePage + 2);
    const out: number[] = [];
    for (let i = startPage; i <= endPage; i++) out.push(i);
    return out;
  }, [safePage, totalPages]);

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Book Quotes</h1>
            <span className="inline-flex items-center justify-center rounded-full border border-zinc-200/60 dark:border-zinc-800/60 bg-black text-white dark:bg-black/30 px-2.5 py-1 text-sm font-semibold tabular-nums">
              {total}
            </span>
          </div>
          <Link className="underline text-sm" href="/quotes/new">
            Add Quote
          </Link>
        </div>

        <div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 p-6 bg-white/50 dark:bg-black/30">
          <input
            value={bookQuery}
            onChange={(e) => {
              setBookQuery(e.target.value);
              setPage(1);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
            dir="auto"
            placeholder="Search by book name..."
            className="w-full rounded-full border border-zinc-200/60 dark:border-zinc-800/60 bg-background px-4 py-2 text-sm mb-5"
          />

          {items.length > 0 ? (
            <div className="grid gap-4">
              {items.map((q, idx) => {
                const rtl = isRtlText(`${q.book} ${q.text} ${q.name}`);
                const n = idx + 1;
                const founder = q.name.trim() === "مؤسس الموقع";
                return (
                  <div
                    key={q.id}
                    dir={rtl ? "rtl" : "ltr"}
                    className="relative rounded-lg border border-zinc-200/60 dark:border-zinc-800/60 bg-background p-4 pt-14 pb-14"
                  >
                    <div
                      className={
                        "absolute bottom-3 " +
                        (rtl ? "left-3 " : "right-3 ") +
                        "inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-zinc-200/60 dark:border-zinc-800/60 bg-white/70 dark:bg-black/40 px-2 text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100 shadow-sm"
                      }
                    >
                      {n}
                    </div>
                    <div className="absolute top-3 left-3 z-[1] flex items-center gap-2">
                      <QuoteCopyButton text={q.text} locale={rtl ? "ar" : "en"} />
                      <QuoteItemActions quote={q} rtl={rtl} />
                    </div>
                    <div
                      className="flex flex-wrap items-start justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div
                          className={
                            "inline-flex max-w-full items-center gap-2 rounded-md bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100 border border-zinc-200/60 dark:border-zinc-800/60 " +
                            ""
                          }
                        >
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white dark:bg-black/30 border border-zinc-200/60 dark:border-zinc-800/60 text-zinc-700 dark:text-zinc-300 shrink-0">
                            <FiBookOpen className="h-4 w-4" />
                          </span>
                          <span dir={rtl ? "rtl" : "ltr"} className="truncate">
                            {q.book}
                          </span>
                        </div>
                        <div
                          dir={rtl ? "rtl" : "ltr"}
                          className={
                            "mt-2 text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap break-words " +
                            (rtl ? "text-right" : "text-left")
                          }
                        >
                          {q.text}
                        </div>
                        <div className={"mt-3 text-xs text-zinc-500 " + (rtl ? "text-right" : "text-left")}>
                          {rtl ? "بواسطة" : "By"}{" "}
                          {founder ? (
                            <span className="inline-flex items-center gap-2 align-middle">
                              <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400/35 via-yellow-300/25 to-amber-400/35 border border-amber-500/40 px-2 py-0.5 font-semibold text-amber-900 dark:text-amber-200">
                                مؤسس الموقع
                              </span>
                            </span>
                          ) : (
                            q.name
                          )}{" "}
                          •{" "}
                          {new Date(q.createdAt).toLocaleDateString(rtl ? "ar-EG" : "en-US")}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                {safePage > 1 ? (
                  <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200/60 dark:border-zinc-800/60 text-sm"
                    onClick={() => setPage(Math.max(1, safePage - 1))}
                    aria-label="Previous page"
                  >
                    <FiChevronLeft className="h-5 w-5" />
                  </button>
                ) : (
                  <span className="h-10 w-10" aria-hidden="true" />
                )}
                <div className="flex flex-wrap items-center gap-2">
                  {pages.map((p) => (
                    <button
                      type="button"
                      key={p}
                      className={
                        (p === safePage
                          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black "
                          : "bg-transparent ") +
                        "inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200/60 dark:border-zinc-800/60 text-sm font-semibold tabular-nums"
                      }
                      onClick={() => setPage(p)}
                      aria-label={`Page ${p}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                {safePage < totalPages ? (
                  <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200/60 dark:border-zinc-800/60 text-sm"
                    onClick={() => setPage(Math.min(totalPages, safePage + 1))}
                    aria-label="Next page"
                  >
                    <FiChevronRight className="h-5 w-5" />
                  </button>
                ) : (
                  <span className="h-10 w-10" aria-hidden="true" />
                )}
              </div>
            </div>
          ) : data && data.ok ? (
            <div className="text-sm text-zinc-600 dark:text-zinc-300">
              {bookQuery.trim() ? (
                <>
                  No results for this search.{" "}
                  {loading ? null : "."}
                </>
              ) : (
                <>
                  No quotes yet.{" "}
                  <Link href="/quotes/new" className="underline">
                    Add the first one
                  </Link>
                  .
                </>
              )}
            </div>
          ) : data && !data.ok ? (
            <div className="text-sm text-zinc-600 dark:text-zinc-300">
              Failed to load quotes.{" "}
              <Link href="/quotes/new" className="underline">
                Add Quote
              </Link>
              .
            </div>
          ) : (
            <div className="text-sm text-zinc-600 dark:text-zinc-300">{loading ? "Loading..." : null}</div>
          )}
        </div>
      </div>
    </section>
  );
}
