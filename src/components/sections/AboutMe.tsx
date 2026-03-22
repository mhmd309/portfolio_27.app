"use client";

import { FiUser, FiChevronRight, FiSmile, FiFileText, FiClock, FiCpu, FiEye } from "react-icons/fi";
import { useEffect, useState, type ComponentType } from "react";
import { animate, useMotionValue } from "framer-motion";

function Stat({
  to,
  label,
  Icon,
  up = 2,
  down = 1.6,
}: {
  to: number;
  label: string;
  Icon: ComponentType<{ className?: string }>;
  up?: number;
  down?: number;
}) {
  const mv = useMotionValue(0);
  const [v, setV] = useState(0);
  useEffect(() => {
    let running = true;
    const unsub = mv.on("change", (x) => setV(Math.round(x)));
    (async () => {
      while (running) {
        await animate(mv, to, { duration: up, ease: "linear" }).finished;
        if (!running) break;
        await new Promise((r) => setTimeout(r, 120000));
        if (!running) break;
        await animate(mv, 0, { duration: down, ease: "linear" }).finished;
        if (!running) break;
        await new Promise((r) => setTimeout(r, 3000));
      }
    })();
    return () => {
      running = false;
      unsub();
    };
  }, [to, up, down, mv]);
  return (
    <div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 p-6 bg-white/50 dark:bg-black/30 text-center">
      <Icon className="mx-auto h-7 w-7 text-zinc-700 dark:text-zinc-300" />
      <div className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">{v}</div>
      <div className="text-xs mt-1 text-zinc-600 dark:text-zinc-400">{label}</div>
    </div>
  );
}

export default function AboutMe() {
  return (
    <section id="about" className="py-16">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center gap-3">
          <FiUser className="h-6 w-6" />
          <h2 className="text-2xl font-bold underline">About Me</h2>
        </div>

        <p className="text-center text-zinc-700">
          Full‑stack developer crafting fast, scalable web apps with TypeScript, React and Next.js on the front end,
          and Node.js, Laravel and Django on the back end. I design clean architectures, write maintainable code,
          and deliver polished UX with Tailwind CSS — data powered by MySQL and modern workflows on GitHub.
        </p>

        <div className="grid md:grid-cols-2 gap-8 md:justify-items-center">
          <div className="md:w-fit md:mx-auto">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <FiChevronRight className="h-4 w-4" />
                <span className="font-bold underline">Name:</span>
                <span className="text-zinc-700">Mohamed Emara</span>
              </li>
              <li className="flex items-center gap-2">
                <FiChevronRight className="h-4 w-4" />
                <span className="font-bold underline">Birthday:</span>
                <span className="text-zinc-700">30/09/1996</span>
              </li>
              <li className="flex items-center gap-2">
                <FiChevronRight className="h-4 w-4" />
                <span className="font-bold underline">Phone:</span>
                <a
                  className="underline text-zinc-700"
                  href="https://wa.me/201020495108"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +201020495108
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FiChevronRight className="h-4 w-4" />
                <span className="font-bold underline">City:</span>
                <span className="text-zinc-700">El-Mansoura, Egypt</span>
              </li>
            </ul>

          </div>
          <div className="md:w-fit md:mx-auto">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <FiChevronRight className="h-4 w-4" />
                <span className="font-bold underline">Age:</span>
                <span className="text-zinc-700">30 years</span>
              </li>
              <li className="flex items-center gap-2">
                <FiChevronRight className="h-4 w-4" />
                <span className="font-bold underline">Degree:</span>
                <span className="text-zinc-700">Master</span>
              </li>
              <li className="flex items-center gap-2">
                <FiChevronRight className="h-4 w-4" />
                <span className="font-bold underline">Email:</span>
                <a className="underline" href="mailto:m.elzero33@gmail.com">
                  m.elzero33@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FiChevronRight className="h-4 w-4" />
                <span className="font-bold underline">Freelance:</span>
                <span className="text-zinc-700">Available</span>
              </li>
            </ul>

          </div>
        </div>
        <div className="mt-6 mb-3 flex flex-col items-center justify-center gap-5">
          <p className="text-zinc-700 text-center">
            I focus on TypeScript‑first development, React/Next.js on the client, and Node.js, Laravel or Django
            on the server. My approach emphasizes clean code, accessibility, performance and solid engineering practices.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="/resume"
              className="flex w-fit items-center gap-2 whitespace-nowrap rounded-lg bg-zinc-900 px-4 py-2 text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
              aria-label="View resume"
            >
              <FiEye className="h-5 w-5" />
              <span>View Resume</span>
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <Stat to={40} label="Happy Clients" Icon={FiSmile} up={2} down={1.4} />
          <Stat to={80} label="Projects" Icon={FiFileText} up={2.4} down={1.6} />
          <Stat to={1050} label="Hours Of Support" Icon={FiClock} up={3} down={2.2} />
          <Stat to={7} label="Hard Workers" Icon={FiCpu} up={1.8} down={1.2} />
        </div>
      </div>
    </section>
  );
}
