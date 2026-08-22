import type { IconType } from "react-icons";
import {
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiBootstrap,
  SiTailwindcss,
  SiPhp,
  SiLaravel,
  SiMysql,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiTypescript,
  SiSupabase,
  SiFramer,
} from "react-icons/si";

export type TechId =
  | "html"
  | "css"
  | "javascript"
  | "bootstrap"
  | "tailwind"
  | "php"
  | "laravel"
  | "mysql"
  | "react"
  | "next"
  | "node"
  | "typescript"
  | "supabase"
  | "framer";

export type TechMeta = {
  label: string;
  Icon: IconType;
  accent: string;
};

export const TECH_META: Record<TechId, TechMeta> = {
  html: { label: "HTML", Icon: SiHtml5, accent: "#E34F26" },
  css: { label: "CSS", Icon: SiCss3, accent: "#1572B6" },
  javascript: { label: "JavaScript", Icon: SiJavascript, accent: "#F7DF1E" },
  bootstrap: { label: "Bootstrap", Icon: SiBootstrap, accent: "#7952B3" },
  tailwind: { label: "Tailwind", Icon: SiTailwindcss, accent: "#06B6D4" },
  php: { label: "PHP", Icon: SiPhp, accent: "#777BB4" },
  laravel: { label: "Laravel", Icon: SiLaravel, accent: "#FF2D20" },
  mysql: { label: "MySQL", Icon: SiMysql, accent: "#4479A1" },
  react: { label: "React", Icon: SiReact, accent: "#61DAFB" },
  next: { label: "Next.js", Icon: SiNextdotjs, accent: "#000000" },
  node: { label: "Node.js", Icon: SiNodedotjs, accent: "#339933" },
  typescript: { label: "TypeScript", Icon: SiTypescript, accent: "#3178C6" },
  supabase: { label: "Supabase", Icon: SiSupabase, accent: "#3ECF8E" },
  framer: { label: "Framer", Icon: SiFramer, accent: "#0055FF" },
};

export const DEFAULT_PROJECT_TECH: TechId[] = ["html", "css", "javascript", "bootstrap"];

export function resolveProjectTechnologies(technologies?: TechId[]): TechId[] {
  return technologies?.length ? technologies : DEFAULT_PROJECT_TECH;
}
