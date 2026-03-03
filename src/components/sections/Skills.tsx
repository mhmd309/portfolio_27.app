 import { FiCode, FiCheckCircle } from "react-icons/fi";
 import {
   SiHtml5,
   SiCss3,
   SiTailwindcss,
   SiJavascript,
   SiReact,
   SiNextdotjs,
   SiPython,
   SiDjango,
   SiNodedotjs,
   SiGithub,
   SiPhp,
   SiLaravel,
   SiMysql,
   SiTypescript,
 } from "react-icons/si";
 
const skills = [
  // Foundations
  { name: "HTML", Icon: SiHtml5 },
  { name: "CSS", Icon: SiCss3 },
  { name: "Tailwind", Icon: SiTailwindcss },
  // Language core
  { name: "JavaScript", Icon: SiJavascript },
  { name: "TypeScript", Icon: SiTypescript },
  // Frontend
  { name: "React", Icon: SiReact },
  { name: "Next.js", Icon: SiNextdotjs },
  // Backend JS
  { name: "Node.js", Icon: SiNodedotjs },
  // Database
  { name: "MySQL", Icon: SiMysql },
  // Alt stacks
  { name: "PHP", Icon: SiPhp },
  { name: "Laravel", Icon: SiLaravel },
  { name: "Python", Icon: SiPython },
  { name: "Django", Icon: SiDjango },
  // Tooling & practices
  { name: "GitHub", Icon: SiGithub },
  { name: "Clean Code", Icon: FiCheckCircle },
];
 
 export default function Skills() {
  return (
    <section id="skills" className="py-16 scroll-mt-24 lg:scroll-mt-28">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <FiCode className="h-6 w-6" />
          <h2 className="text-2xl font-bold underline">Skills</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {skills.map(({ name, Icon }) => (
            <div
              key={name}
              className="flex flex-col items-center justify-center rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 p-4 bg-white/50 dark:bg-black/30"
            >
              <Icon className="h-8 w-8 mb-2" />
              <span className="text-sm">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
 }
