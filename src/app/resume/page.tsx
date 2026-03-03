import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  FiUser,
  FiStar,
  FiBriefcase,
  FiCamera,
  FiMusic,
  FiArrowLeft,
} from "react-icons/fi";
import { TbFlask, TbPlane, TbBookmark, TbBallFootball } from "react-icons/tb";

export const metadata: Metadata = {
  title: "Resume | Eng Mohamed Emara",
  description: "Live resume replicating the original CV design",
};

const strengths = [
  "Leadership",
  "Collaboration",
  "Problem-Solving",
  "Mentorship",
  "Adaptability",
  "User Focus",
  "Process Improvement",
  "Cross-Functional Communication",
  "Continuous Learning",
  "Efficiency Enhancement",
];

export default function ResumePage() {
  return (
    <section className="relative py-10 sm:py-14">
      <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 sm:h-96 sm:w-96">
        <div className="absolute right-4 top-6 h-28 w-28 rounded-full bg-[#e8a7b3]/70 blur-0" />
        <div className="absolute right-24 top-0 h-16 w-16 rounded-full bg-[#b9d2dc]/80" />
        <div className="absolute right-6 top-36 h-16 w-16 rounded-full bg-[#e6d2b8]/80" />
        <div className="absolute right-16 top-20 h-24 w-24 rounded-full bg-[#c6dae2]/80" />
        <div className="absolute right-12 top-10 h-36 w-36 rounded-full bg-[#f2c8d0]/70" />
        <div className="absolute right-14 top-18 h-24 w-24 overflow-hidden rounded-full ring-2 ring-white/70">
          <Image src="/icon.jpg" alt="Profile" width={160} height={160} />
        </div>
      </div>
      <div className="pointer-events-none absolute -bottom-10 right-6 h-40 w-40">
        <div className="absolute bottom-0 right-0 h-12 w-12 rounded-full bg-[#b9d2dc]/80" />
        <div className="absolute -bottom-6 -right-6 h-16 w-16 rounded-full bg-[#f2c8d0]/70" />
        <div className="absolute -bottom-2 right-10 h-6 w-6 rounded-full bg-[#e6d2b8]/80" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-8 sm:mb-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-none">Eng Mohamed Emara<span> .</span></h1>
              <ul className="mt-3 space-y-1.5 text-sm text-zinc-700 dark:text-zinc-300">
                <li>Date of birth: 22/09/1996</li>
                <li>Nationality: Egypt</li>
                <li>Address: Daqahliya, Mansoura, Egypt</li>
                <li>Phone number: 01020495108</li>
                <li>
                  Email address:{" "}
                  <a className="underline" href="mailto:m.elzero33@gmail.com">
                    m.elzero33@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-black/30">
              <div className="flex items-center gap-2 px-5 pt-5">
                <span className="inline-flex items-center gap-2 rounded-2xl bg-[#bcd0d9] px-4 py-2 text-sm font-semibold">
                  <FiUser className="h-4 w-4" /> Profile
                </span>
              </div>
              <div className="p-5 pt-3 text-zinc-700 dark:text-zinc-300">
                <p>
                  Full‑stack developer crafting fast, scalable web apps with TypeScript, React and Next.js on the front end,
                  and Node.js, Laravel and Django on the back end. I design clean architectures, write maintainable code,
                  and deliver polished UX with Tailwind CSS — data powered by MySQL and modern workflows on GitHub.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-black/30">
              <div className="flex items-center gap-2 px-5 pt-5">
                <span className="inline-flex items-center gap-2 rounded-2xl bg-[#bcd0d9] px-4 py-2 text-sm font-semibold">
                  <FiBriefcase className="h-4 w-4" /> Work Experience
                </span>
              </div>
              <div className="p-5 pt-3">
                <div className="text-xs tracking-widest text-zinc-500">04/2023 – PRESENT&nbsp;&nbsp; MANSOURA, CAIRO</div>
                <div className="mt-1 text-lg font-semibold">Full-Stack Developer</div>
                <div className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Future Of Egypt</div>
                <ul className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <li className="flex gap-2"><span className="mt-1 h-[6px] w-[6px] rounded-full bg-zinc-500" /><span>Developed and maintained web applications using both front-end and back-end technologies, ensuring seamless user experiences and robust functionality across platforms.</span></li>
                  <li className="flex gap-2"><span className="mt-1 h-[6px] w-[6px] rounded-full bg-zinc-500" /><span>Led the redesign of a key product feature, resulting in a 30% increase in user engagement, which directly contributed to a 15% boost in subscription renewals over six months.</span></li>
                  <li className="flex gap-2"><span className="mt-1 h-[6px] w-[6px] rounded-full bg-zinc-500" /><span>Implemented automated testing processes that reduced bugs in production by 25%, helping the team deliver high-quality releases on schedule.</span></li>
                  <li className="flex gap-2"><span className="mt-1 h-[6px] w-[6px] rounded-full bg-zinc-500" /><span>Collaborated with cross-functional teams, including designers and product managers, to align project goals and streamline development workflows, which improved overall project efficiency by 20%.</span></li>
                  <li className="flex gap-2"><span className="mt-1 h-[6px] w-[6px] rounded-full bg-zinc-500" /><span>Provided mentorship and guidance to junior developers, fostering a culture of continuous learning and helping to elevate the team's technical skills.</span></li>
                </ul>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-black/30">
              <div className="flex items-center gap-2 px-5 pt-5">
                <span className="inline-flex items-center gap-2 rounded-2xl bg-[#bcd0d9] px-4 py-2 text-sm font-semibold">
                  <TbFlask className="h-4 w-4" /> Skills
                </span>
              </div>
              <div className="p-5 pt-3">
                <ul className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                  <li className="flex items-center justify-between py-1.5">
                    <span>React/Next/Node</span>
                    <span className="font-semibold">Professional</span>
                  </li>
                  <li className="flex items-center justify-between py-1.5">
                    <span>HTML/CSS</span>
                    <span className="font-semibold">Professional</span>
                  </li>
                  <li className="flex items-center justify-between py-1.5">
                    <span>Back-end Developer</span>
                    <span className="font-semibold">Professional</span>
                  </li>
                  <li className="flex items-center justify-between py-1.5">
                    <span>Web Application</span>
                    <span className="font-semibold">Professional</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-black/30">
              <div className="flex items-center gap-2 px-5 pt-5">
                <span className="inline-flex items-center gap-2 rounded-2xl bg-[#f2c8d0] px-4 py-2 text-sm font-semibold">
                  <FiStar className="h-4 w-4" /> Strengths
                </span>
              </div>
              <div className="p-5 pt-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
                  <ul className="space-y-2 text-sm">
                    {strengths.slice(0, 5).map((s) => (
                      <li key={s} className="text-zinc-700 dark:text-zinc-300">
                        <span className="text-rose-500">#</span> {s}
                      </li>
                    ))}
                  </ul>
                  <ul className="space-y-2 text-sm">
                    {strengths.slice(5).map((s) => (
                      <li key={s} className="text-zinc-700 dark:text-zinc-300">
                        <span className="text-rose-500">#</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-black/30">
              <div className="flex items-center gap-2 px-5 pt-5">
                <span className="inline-flex items-center gap-2 rounded-2xl bg-[#f2c8d0] px-4 py-2 text-sm font-semibold">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#d98796]">
                    <TbPlane className="h-3.5 w-3.5" />
                  </span>
                  Hobbies
                </span>
              </div>
              <div className="p-5 pt-4">
                <ul className="grid grid-cols-3 justify-items-center gap-2 text-center">
                  <li className="flex flex-col items-center gap-2 py-3 px-4 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-zinc-700 dark:text-zinc-300">
                      <TbPlane className="h-6 w-6" />
                    </span>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">Exploring distant lands</span>
                  </li>
                  <li className="flex flex-col items-center gap-2 py-3 px-4 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-zinc-700 dark:text-zinc-300">
                      <TbBookmark className="h-6 w-6" />
                    </span>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">Getting lost in a good book</span>
                  </li>
                  <li className="flex flex-col items-center gap-2 py-3 px-4 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-zinc-700 dark:text-zinc-300">
                      <FiCamera className="h-6 w-6" />
                    </span>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">Capturing moments</span>
                  </li>
                </ul>
                <ul className="mt-2 grid grid-cols-2 justify-items-center text-center">
                  <li className="flex flex-col items-center gap-2 py-3 px-4 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-zinc-700 dark:text-zinc-300">
                      <FiMusic className="h-6 w-6" />
                    </span>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">Feeling the music</span>
                  </li>
                  <li className="flex flex-col items-center gap-2 py-3 px-4 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-zinc-700 dark:text-zinc-300">
                      <TbBallFootball className="h-6 w-6" />
                    </span>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">Every kind of sport</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-black dark:hover:bg-white transition-colors"
          >
            <FiArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
