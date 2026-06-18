import clsx from "clsx";
import { TECH_META, type TechId } from "../data/technologies";

type Props = {
  technologies: TechId[];
  compact?: boolean;
};

export default function ProjectTechTags({ technologies, compact = false }: Props) {
  if (!technologies.length) return null;

  return (
    <div
      className={clsx(
        "rounded-lg border border-zinc-100 bg-zinc-50/90 dark:border-zinc-800/80 dark:bg-zinc-900/50",
        compact ? "p-2" : "p-2.5"
      )}
      aria-label="Technologies used"
    >
      <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        Tech Stack
      </p>
      <div className="flex flex-wrap gap-1">
        {technologies.map((id) => {
          const { label, Icon, accent } = TECH_META[id];
          const isLightAccent = id === "javascript" || id === "react";
          const isDarkAccent = id === "next";
          return (
            <span
              key={id}
              className={clsx(
                "inline-flex h-5 items-center gap-1 rounded border px-1.5 text-[10px] font-medium leading-none transition-colors duration-200",
                isDarkAccent && "dark:!border-zinc-600 dark:!bg-zinc-800 dark:!text-zinc-100"
              )}
              style={{
                color: isLightAccent ? "#1a1a1a" : isDarkAccent ? "#171717" : accent,
                borderColor: `${accent}35`,
                backgroundColor: `${accent}12`,
              }}
            >
              <Icon className="h-2.5 w-2.5 shrink-0 opacity-90" aria-hidden />
              <span className="whitespace-nowrap">{label}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
