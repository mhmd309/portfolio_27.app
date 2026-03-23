import Link from "next/link";
import { headers } from "next/headers";
import { FiBookOpen } from "react-icons/fi";
import QuoteCopyButton from "src/components/QuoteCopyButton";

type Quote = {
  id: string;
  name: string;
  email: string;
  book: string;
  text: string;
  createdAt: string;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

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

async function baseUrl() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") || "http";
  const host = h.get("x-forwarded-host") || h.get("host");
  if (host) return `${proto}://${host}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  return "http://localhost:3000";
}

async function fetchQuotesPage(page: number, pageSize: number): Promise<QuotesApiResponse> {
  try {
    const url = new URL("/api/quotes", await baseUrl());
    url.searchParams.set("page", String(page));
    url.searchParams.set("pageSize", String(pageSize));
    const res = await fetch(url.toString(), { cache: "no-store" });
    const json = (await res.json().catch(() => null)) as QuotesApiResponse | null;
    if (!res.ok || !json) return { ok: false, error: `HTTP_${res.status}` };
    return json;
  } catch {
    return { ok: false, error: "FETCH_FAILED" };
  }
}

type Props = {
  searchParams?: Promise<SearchParams>;
};

export default async function QuotesPage({ searchParams }: Props) {
  const pageSize = 20;
  const sp = (await searchParams) || {};
  const rawPage = typeof sp.page === "string" ? Number(sp.page) || 1 : 1;
  const initialPage = Math.max(1, rawPage);
  const first = await fetchQuotesPage(initialPage, pageSize);
  const total = first.ok ? first.total : 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = clamp(initialPage, 1, totalPages);
  const data = safePage !== initialPage ? await fetchQuotesPage(safePage, pageSize) : first;
  const items = data.ok ? data.items : [];

  const startPage = Math.max(1, safePage - 2);
  const endPage = Math.min(totalPages, safePage + 2);
  const pages: number[] = [];
  for (let i = startPage; i <= endPage; i++) pages.push(i);

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Book Quotes</h1>
          <Link className="underline text-sm" href="/quotes/new">
            Add Quote
          </Link>
        </div>

        <div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 p-6 bg-white/50 dark:bg-black/30">
          {items.length > 0 ? (
            <div className="grid gap-4">
              {items.map((q) => {
                const rtl = isRtlText(`${q.book} ${q.text} ${q.name}`);
                return (
                  <div
                    key={q.id}
                    dir={rtl ? "rtl" : "ltr"}
                    className="rounded-lg border border-zinc-200/60 dark:border-zinc-800/60 bg-background p-4"
                  >
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
                          {rtl ? "بواسطة" : "By"} {q.name} •{" "}
                          {new Date(q.createdAt).toLocaleDateString(rtl ? "ar-EG" : "en-US")}
                        </div>
                      </div>
                      <QuoteCopyButton text={q.text} locale={rtl ? "ar" : "en"} />
                    </div>
                  </div>
                );
              })}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <Link
                  aria-disabled={safePage <= 1}
                  className={
                    (safePage <= 1 ? "pointer-events-none opacity-50 " : "") +
                    "inline-flex items-center justify-center rounded-md border border-zinc-200/60 dark:border-zinc-800/60 px-3 py-2 text-sm"
                  }
                  href={`/quotes?page=${Math.max(1, safePage - 1)}`}
                >
                  Prev
                </Link>
                <div className="flex flex-wrap items-center gap-2">
                  {pages.map((p) => (
                    <Link
                      key={p}
                      className={
                        (p === safePage
                          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black "
                          : "bg-transparent ") +
                        "inline-flex items-center justify-center rounded-md border border-zinc-200/60 dark:border-zinc-800/60 px-3 py-2 text-sm"
                      }
                      href={`/quotes?page=${p}`}
                    >
                      {p}
                    </Link>
                  ))}
                </div>
                <Link
                  aria-disabled={safePage >= totalPages}
                  className={
                    (safePage >= totalPages ? "pointer-events-none opacity-50 " : "") +
                    "inline-flex items-center justify-center rounded-md border border-zinc-200/60 dark:border-zinc-800/60 px-3 py-2 text-sm"
                  }
                  href={`/quotes?page=${Math.min(totalPages, safePage + 1)}`}
                >
                  Next
                </Link>
              </div>
            </div>
          ) : data.ok ? (
            <div className="text-sm text-zinc-600 dark:text-zinc-300">
              No quotes yet.{" "}
              <Link href="/quotes/new" className="underline">
                Add the first one
              </Link>
              .
            </div>
          ) : (
            <div className="text-sm text-zinc-600 dark:text-zinc-300">
              Failed to load quotes.{" "}
              <Link href="/quotes/new" className="underline">
                Add Quote
              </Link>
              .
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
