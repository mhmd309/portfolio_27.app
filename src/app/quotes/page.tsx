import Link from "next/link";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
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

type GitHubConfig = {
  token: string;
  repo: string;
  filePath: string;
  branch: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function isRtlText(text: string) {
  return /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(text);
}

function storePath() {
  const fromEnv = process.env.QUOTES_STORE_PATH;
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL) return path.join(os.tmpdir(), "portfolio_27.app", "quotes.json");
  return path.join(process.cwd(), "data", "quotes.json");
}

function githubConfig(): GitHubConfig | null {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo) return null;
  const filePath = process.env.GITHUB_QUOTES_PATH || "data/quotes.json";
  const branch = process.env.GITHUB_BRANCH || "main";
  return { token, repo, filePath, branch };
}

function githubContentsUrl(cfg: GitHubConfig) {
  const encodedPath = cfg.filePath.split("/").map(encodeURIComponent).join("/");
  const encodedRepo = cfg.repo.split("/").map(encodeURIComponent).join("/");
  return `https://api.github.com/repos/${encodedRepo}/contents/${encodedPath}?ref=${encodeURIComponent(cfg.branch)}`;
}

async function readAllFromGitHub(cfg: GitHubConfig): Promise<Quote[]> {
  const res = await fetch(githubContentsUrl(cfg), {
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`GITHUB_READ_${res.status}`);
  const json = (await res.json()) as { content?: string; encoding?: string };
  const content = typeof json.content === "string" ? json.content : "";
  const encoding = typeof json.encoding === "string" ? json.encoding : "";
  if (!content || encoding !== "base64") return [];
  const raw = Buffer.from(content, "base64").toString("utf8");
  const data = JSON.parse(raw) as unknown;
  if (!Array.isArray(data)) return [];
  return data.filter(Boolean) as Quote[];
}

async function readAll(): Promise<Quote[]> {
  const cfg = githubConfig();
  if (cfg) return readAllFromGitHub(cfg);
  const p = storePath();
  try {
    const raw = await fs.readFile(p, "utf8");
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data.filter(Boolean) as Quote[];
  } catch {
    return [];
  }
}

type Props = {
  searchParams?: Promise<SearchParams>;
};

export default async function QuotesPage({ searchParams }: Props) {
  const pageSize = 25;
  const sp = (await searchParams) || {};
  const rawPage = typeof sp.page === "string" ? Number(sp.page) || 1 : 1;
  const all = await readAll();
  const sorted = [...all].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = clamp(Math.max(1, rawPage), 1, totalPages);
  const start = (page - 1) * pageSize;
  const items = sorted.slice(start, start + pageSize);

  const startPage = Math.max(1, page - 2);
  const endPage = Math.min(totalPages, page + 2);
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
                      className={
                        "flex flex-wrap items-start justify-between gap-3 " + (rtl ? "flex-row-reverse" : "")
                      }
                    >
                      <div className="min-w-0">
                        <div
                          className={
                            "inline-flex max-w-full items-center gap-2 rounded-md bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100 border border-zinc-200/60 dark:border-zinc-800/60 " +
                            (rtl ? "flex-row-reverse" : "")
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
                  aria-disabled={page <= 1}
                  className={
                    (page <= 1 ? "pointer-events-none opacity-50 " : "") +
                    "inline-flex items-center justify-center rounded-md border border-zinc-200/60 dark:border-zinc-800/60 px-3 py-2 text-sm"
                  }
                  href={`/quotes?page=${Math.max(1, page - 1)}`}
                >
                  Prev
                </Link>
                <div className="flex flex-wrap items-center gap-2">
                  {pages.map((p) => (
                    <Link
                      key={p}
                      className={
                        (p === page
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
                  aria-disabled={page >= totalPages}
                  className={
                    (page >= totalPages ? "pointer-events-none opacity-50 " : "") +
                    "inline-flex items-center justify-center rounded-md border border-zinc-200/60 dark:border-zinc-800/60 px-3 py-2 text-sm"
                  }
                  href={`/quotes?page=${Math.min(totalPages, page + 1)}`}
                >
                  Next
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-sm text-zinc-600 dark:text-zinc-300">
              No quotes yet.{" "}
              <Link href="/quotes/new" className="underline">
                Add the first one
              </Link>
              .
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
