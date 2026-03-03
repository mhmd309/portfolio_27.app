"use client";

import { FiFolder, FiCalendar, FiEye, FiLoader, FiEyeOff } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { projects as data, type Project } from "../../data/projects";

export default function Projects() {
  const [visible, setVisible] = useState(6);
  const [tab, setTab] = useState<"all" | "done" | "new" | "soon">("all");
  const [loadingMore, setLoadingMore] = useState(false);
  const categoryOf = (p: Project): "done" | "new" | "soon" => {
    const s = (p.status || "").toLowerCase();
    const b = (p.brand || "").toLowerCase();
    if (s === "new" || b === "new") return "new";
    if (s === "soon" || b === "soon") return "soon";
    return "done";
  };
  const stats = useMemo(() => {
    let done = 0, newer = 0, soon = 0;
    for (const p of data) {
      const c = categoryOf(p);
      if (c === "new") newer++;
      else if (c === "soon") soon++;
      else done++;
    }
    return { all: data.length, done, newer, soon };
  }, []);
  const handleLoadMore = () => {
    setLoadingMore(true);
    setVisible((v) => v + 6);
    setTimeout(() => setLoadingMore(false), 400);
  };
  const parseDate = (s: string) => {
    const v = s.trim();
    const parts = v.split("-");
    if (parts.length === 3) {
      let y: number, m: number, d: number;
      if (parts[0].length === 4) {
        y = Number(parts[0]);
        m = Number(parts[1]);
        d = Number(parts[2]);
      } else {
        d = Number(parts[0]);
        m = Number(parts[1]);
        y = Number(parts[2]);
      }
      return new Date(Date.UTC(y, m - 1, d));
    }
    return new Date(v);
  };
  const sorted = useMemo(
    () => [...data].sort((a, b) => (parseDate(b.date).getTime() || 0) - (parseDate(a.date).getTime() || 0)),
    []
  );
  const filtered = useMemo(() => {
    if (tab === "all") return sorted;
    return sorted.filter((p) => categoryOf(p) === tab);
  }, [sorted, tab]);
  const current = filtered.slice(0, visible);
  const canLoadMore = visible < filtered.length;
  const formatDate = (s: string) => {
    const v = s.trim();
    const parts = v.split("-");
    if (parts.length !== 3) return v;
    if (parts[0].length === 4) {
      const yy = parts[0];
      const mm = parts[1].padStart(2, "0");
      const dd = parts[2].padStart(2, "0");
      return `${dd}/${mm}/${yy}`;
    }
    const dd = parts[0].padStart(2, "0");
    const mm = parts[1].padStart(2, "0");
    const yy = parts[2];
    return `${dd}/${mm}/${yy}`;
  };
  return (
    <section id="projects" className="py-16 scroll-mt-24 lg:scroll-mt-28">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <FiFolder className="h-6 w-6" />
            <h2 className="text-2xl font-bold underline">Projects</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs" role="tablist" aria-label="Projects filter">
            <button
              role="tab"
              aria-selected={tab === "all"}
              onClick={() => {
                setTab("all");
                setVisible(6);
              }}
              className={
                (tab === "all"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black "
                  : "bg-transparent") +
                "inline-flex items-center gap-2 rounded-[5px] border border-zinc-200/60 dark:border-zinc-800/60 px-3 py-1 cursor-pointer transition-colors duration-200"
              }
            >
              All: {stats.all}
            </button>
            <button
              role="tab"
              aria-selected={tab === "done"}
              onClick={() => {
                setTab("done");
                setVisible(6);
              }}
              className={
                (tab === "done"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black "
                  : "bg-transparent") +
                "inline-flex items-center gap-2 rounded-[5px] border border-zinc-200/60 dark:border-zinc-800/60 px-3 py-1 cursor-pointer transition-colors duration-200"
              }
            >
              Done: {stats.done}
            </button>
            <button
              role="tab"
              aria-selected={tab === "new"}
              onClick={() => {
                setTab("new");
                setVisible(6);
              }}
              className={
                (tab === "new"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black "
                  : "bg-transparent text-inherit ") +
                "inline-flex items-center gap-2 rounded-[5px] border border-zinc-200/60 dark:border-zinc-800/60 px-3 py-1 cursor-pointer transition-colors duration-200"
              }
            >
              New: {stats.newer}
            </button>
            <button
              role="tab"
              aria-selected={tab === "soon"}
              onClick={() => {
                setTab("soon");
                setVisible(6);
              }}
              className={
                (tab === "soon"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black "
                  : "bg-transparent text-inherit ") +
                "inline-flex items-center gap-2 rounded-[5px] border border-zinc-200/60 dark:border-zinc-800/60 px-3 py-1 cursor-pointer transition-colors duration-200"
              }
            >
              Soon: {stats.soon}
            </button>
          </div>
        </div>
        {current.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {current.map((p: Project) => (
              <div
                key={`${p.title}-${p.date}`}
                className="group rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-black/30 overflow-hidden hover:cursor-pointer"
              >
                <div className="relative h-44 bg-zinc-50 dark:bg-zinc-900 overflow-hidden">
                  {p.brand ? (
                    <span
                      className={
                        "absolute left-3 top-3 z-10 rounded-md text-white text-xs px-2 py-1 " +
                        ((p.brand || "").toLowerCase() === "new"
                          ? "bg-[#BF092F]"
                          : (p.brand || "").toLowerCase() === "soon"
                            ? "bg-[#B87C4C]"
                            : "bg-emerald-600")
                      }
                    >
                      {p.brand}
                    </span>
                  ) : null}
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
                    priority={false}
                  />
                  <div className="absolute inset-x-0 bottom-[4] flex justify-center z-50">
                    <Link
                      href={p.link || "#"}
                      target={p.link ? "_blank" : "_self"}
                      className="group inline-flex items-center gap-2 rounded-md px-4 py-2 bg-white/95 dark:bg-zinc-900/95 border border-zinc-200/60 hover:border-zinc-800/60 hover:bg-black/100 hover:text-white cursor-pointer transition-colors duration-600"
                    >
                      <span>View Now</span>
                      <FiEye className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
                <div className="pt-6 p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-semibold">
                      <FiFolder className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                      <span>{p.title}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400">
                      <FiCalendar className="h-4 w-4" />
                      <span>{formatDate(p.date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-black/30 py-16 flex flex-col items-center justify-center text-center">
            <FiEyeOff className="h-8 w-8 text-zinc-500 mb-3" />
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              No content is currently available in this section.
            </p>
          </div>
        )}
        {canLoadMore ? (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleLoadMore}
              className="inline-flex items-center justify-center rounded-md px-4 py-2 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-black dark:hover:bg-white transition-colors duration-200 cursor-pointer"
            >
              <FiLoader className={"mr-2 h-4 w-4 " + (loadingMore ? "animate-spin" : "")} />
              View more
            </button>
          </div>
        ) : filtered.length > 6 ? (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setVisible(6)}
              className="inline-flex items-center justify-center rounded-md px-4 py-2 border border-zinc-200/60 dark:border-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer"
            >
              View less
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
