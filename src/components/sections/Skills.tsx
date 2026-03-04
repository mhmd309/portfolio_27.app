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
  { name: "HTML", Icon: SiHtml5, percent: 95 },
  { name: "CSS", Icon: SiCss3, percent: 95 },
  { name: "Tailwind", Icon: SiTailwindcss, percent: 95 },
  { name: "JavaScript", Icon: SiJavascript, percent: 90 },
  { name: "TypeScript", Icon: SiTypescript, percent: 90 },
  { name: "React", Icon: SiReact, percent: 90 },
  { name: "Next.js", Icon: SiNextdotjs, percent: 80 },
  { name: "Node.js", Icon: SiNodedotjs, percent: 80 },
  { name: "MySQL", Icon: SiMysql, percent: 95 },
  { name: "PHP", Icon: SiPhp, percent: 95 },
  { name: "Laravel", Icon: SiLaravel, percent: 95 },
  { name: "Python", Icon: SiPython, percent: 50 },
  { name: "Django", Icon: SiDjango, percent: 50 },
  { name: "GitHub", Icon: SiGithub, percent: 99 },
  { name: "Clean Code", Icon: FiCheckCircle, percent: 99 },
];
 
 function colorFor(percent: number) {
   if (percent >= 95) return "#16a34a";
   if (percent >= 90) return "#22c55e";
   if (percent >= 80) return "#3b82f6";
   if (percent >= 60) return "#eab308";
   return "#ef4444";
 }
 
 function CircularProgress({ percent, size = 40 }: { percent: number; size?: number }) {
   const stroke = 4;
   const r = Math.max(1, (size - stroke) / 2 - 2);
   const c = 2 * Math.PI * r;
   const dash = Math.max(0, Math.min(c, c * (percent / 100)));
   const color = colorFor(percent);
   const view = size;
   const center = view / 2;
   return (
     <div className="relative" style={{ width: view, height: view }}>
       <svg width={view} height={view} viewBox={`0 0 ${view} ${view}`} aria-hidden="true">
         <circle
           cx={center}
           cy={center}
           r={r}
           strokeWidth={stroke}
           className="text-zinc-300 dark:text-zinc-700"
           stroke="currentColor"
           fill="transparent"
         />
         <circle
           cx={center}
           cy={center}
           r={r}
           strokeWidth={stroke}
           strokeLinecap="round"
           stroke={color}
           fill="transparent"
           strokeDasharray={`${dash} ${c}`}
           transform={`rotate(-90 ${center} ${center})`}
         />
       </svg>
       <div className="absolute inset-0 flex items-center justify-center">
         <span className="text-[12px] font-semibold leading-none text-zinc-900 dark:text-zinc-100">
           {percent}%
         </span>
       </div>
     </div>
   );
 }
 
 export default function Skills() {
  return (
    <section id="skills" className="py-16 scroll-mt-24 lg:scroll-mt-28">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <FiCode className="h-6 w-6" />
          <h2 className="text-2xl font-bold underline">Skills</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {skills.map(({ name, Icon, percent }) => (
            <div
              key={name}
              className="relative flex flex-col items-center justify-center rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 p-4 bg-white/50 dark:bg-black/30"
            >
              <div className="absolute top-2 right-2">
                <CircularProgress percent={percent} size={40} />
              </div>
              <Icon className="h-8 w-8 mb-2" />
              <span className="text-sm">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
 }
