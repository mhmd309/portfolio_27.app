"use client";

import { FiFolder, FiEye, FiEyeOff, FiRefreshCw } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { projects as data, type Project } from "../../data/projects";
import { resolveProjectTechnologies } from "../../data/technologies";
import ProjectTechTags from "../ProjectTechTags";

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
  const filtered = useMemo(() => {
    if (tab === "all") return data;
    return data.filter((p) => categoryOf(p) === tab);
  }, [tab]);
  const current = filtered.slice(0, visible);
  const canLoadMore = visible < filtered.length;
  return (
    <section id="projects" className="py-16 scroll-mt-24 lg:scroll-mt-28">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center justify-center text-center gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div className="flex items-center gap-3 justify-center">
            <FiFolder className="h-6 w-6" />
            <h2 className="text-2xl font-bold underline">Projects</h2>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:justify-start" role="tablist" aria-label="Projects filter">
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
          <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {current.map((p: Project) => (
              <div
                key={p.title}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200/60 bg-white/50 dark:border-zinc-800/60 dark:bg-black/30 hover:cursor-pointer"
              >
                <div className="relative h-40 shrink-0 overflow-hidden bg-zinc-50 dark:bg-zinc-900 sm:h-44">
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
                  {p.isUpgrade ? (
                    <span className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-md bg-amber-500 text-white text-xs px-2 py-1">
                      <FiRefreshCw className="h-3 w-3" />
                      Upgrade
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
                </div>
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="flex items-center gap-2 border-b border-zinc-100 pb-2.5 dark:border-zinc-800/80">
                    <FiFolder className="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400" />
                    <h3 className="truncate text-sm font-semibold tracking-tight">{p.title}</h3>
                  </div>

                  <div className="flex-1">
                    <ProjectTechTags technologies={resolveProjectTechnologies(p.technologies)} />
                  </div>

                  <div className="mt-auto">
                    {p.isDisabled ? (
                      <button
                        disabled
                        className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-zinc-200/80 bg-zinc-50 px-3 text-xs font-medium text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-500 cursor-not-allowed"
                      >
                        <FiEyeOff className="h-3.5 w-3.5" />
                        <span>Coming Soon</span>
                      </button>
                    ) : (
                      <Link
                        href={p.link || "#"}
                        target={p.link ? "_blank" : "_self"}
                        className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-zinc-200/60 bg-zinc-50 px-3 text-xs font-medium transition-colors duration-300 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white dark:border-zinc-700 dark:bg-zinc-900/80 dark:hover:border-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-black"
                      >
                        <FiEye className="h-3.5 w-3.5" />
                        <span>View Now</span>
                      </Link>
                    )}
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
              disabled={loadingMore}
              className="inline-flex items-center justify-center rounded-md px-4 py-2 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-black dark:hover:bg-white transition-colors duration-200 cursor-pointer"
            >
              <FiEye className="mr-2 h-4 w-4" />
              View more
            </button>
          </div>
        ) : filtered.length > 6 ? (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setVisible(6)}
              className="inline-flex items-center justify-center rounded-md px-4 py-2 border border-zinc-200/60 dark:border-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer"
            >
              <FiEyeOff className="mr-2 h-4 w-4" />
              View less
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
