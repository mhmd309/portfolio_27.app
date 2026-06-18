import clsx from "clsx";
import { TECH_META, type TechId } from "../data/technologies";

type Props = {
  technologies: TechId[];
};

export default function ProjectTechTags({ technologies }: Props) {
  if (!technologies.length) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Technologies used">
      {technologies.map((id) => {
        const { label, Icon, accent } = TECH_META[id];
        const isLightAccent = id === "javascript" || id === "react";
        const isDarkAccent = id === "next";
        return (
          <span
            key={id}
            className={clsx(
              "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide shadow-sm transition-all duration-200 group-hover:shadow-md dark:shadow-none",
              isDarkAccent && "dark:!border-zinc-500 dark:!bg-zinc-800 dark:!text-zinc-100"
            )}
            style={{
              color: isLightAccent ? "#1a1a1a" : isDarkAccent ? "#171717" : accent,
              borderColor: `${accent}40`,
              backgroundColor: `${accent}18`,
            }}
          >
            <Icon className="h-3 w-3 shrink-0 opacity-90" aria-hidden />
            <span className="leading-none">{label}</span>
          </span>
        );
      })}
    </div>
  );
}
