"use client";

import { FiUser, FiFolder, FiCode, FiMail, FiX, FiChevronLeft } from "react-icons/fi";
import { TbSlideshow } from "react-icons/tb";
import clsx from "clsx";

import { useEffect, useState } from "react";
const items = [
  { href: "#hero", label: "HOME", Icon: TbSlideshow },
  { href: "#about", label: "ABOUT ME", Icon: FiUser },
  { href: "#projects", label: "PROJECTS", Icon: FiFolder },
  { href: "#skills", label: "SKILLS", Icon: FiCode },
  { href: "#contact", label: "CONTACT ME", Icon: FiMail },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({ open, onClose }: Props) {
  const [active, setActive] = useState<string>("#hero");
  useEffect(() => {
    const elems = items
      .map(({ href }) => document.querySelector(href) as HTMLElement | null)
      .filter(Boolean) as HTMLElement[];
    if (elems.length === 0) return;
    const updateByScroll = () => {
      const y = Math.floor(window.innerHeight * 0.35);
      for (const { href } of items) {
        const el = document.querySelector(href) as HTMLElement | null;
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= y && r.bottom >= y) {
          setActive(href);
          break;
        }
      }
    };
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          updateByScroll();
          ticking = false;
        });
      }
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top = entries.find((e) => e.isIntersecting);
        if (top) setActive(`#${top.target.id}`);
      },
      { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1], rootMargin: "-64px 0px -45% 0px" }
    );
    elems.forEach((el) => io.observe(el));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    let ro: ResizeObserver | null = null;
    const proj = document.querySelector("#projects") as HTMLElement | null;
    if (proj && "ResizeObserver" in window) {
      ro = new ResizeObserver(() => updateByScroll());
      ro.observe(proj);
    }
    updateByScroll();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      ro?.disconnect();
    };
  }, []);
  return (
    <>
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      <aside
        className={clsx(
          "fixed z-50 left-0 top-0 h-screen w-72 bg-background border-r border-zinc-200/60 shadow-sm transition-transform",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-200/60 font-semibold">
          Mohamed Emara
          <div className="flex items-center">
            <button
              onClick={onClose}
              className="rounded-md p-2 bg-zinc-100 lg:hidden cursor-pointer"
              aria-label="Close sidebar"
              title="Close"
            >
              <FiX className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="hidden lg:inline-flex rounded-md p-2 bg-zinc-100 cursor-pointer"
              aria-label="Collapse sidebar"
              title="Collapse"
            >
              <FiChevronLeft className="h-5 w-5" />
            </button>
          </div>
        </div>
        <nav className="px-2 py-4">
          <ul className="space-y-1">
            {items.map(({ href, label, Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  aria-current={active === href ? "page" : undefined}
                  onClick={() => setActive(href)}
                  className={clsx(
                    "group relative overflow-hidden flex items-center gap-3 rounded-md px-3 py-2 text-zinc-700 cursor-pointer transition-colors duration-200 ease-out",
                    active === href &&
                      "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 ring-1 ring-zinc-300/60 dark:ring-zinc-700/60"
                  )}
                >
                  <span aria-hidden className={clsx(
                    "absolute inset-y-0 left-0 bg-zinc-100 dark:bg-zinc-900 transition-[width] duration-300 ease-out",
                    "w-0 group-hover:w-full"
                  )} />
                  {active === href ? (
                    <span
                      aria-hidden
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-3/5 w-[3px] rounded-r bg-zinc-900 dark:bg-zinc-100"
                    />
                  ) : null}
                  <Icon className={clsx("relative z-10 h-5 w-5", active === href && "text-zinc-900 dark:text-zinc-100")} />
                  <span className={clsx("relative z-10", active === href && "font-semibold")}>{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
