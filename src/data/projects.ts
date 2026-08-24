import type { TechId } from "./technologies";

export type ProjectStatus = "done" | "new" | "soon";
export type Project = {
  title: string;
  image: string;
  link: string;
  status?: ProjectStatus;
  brand?: string;
  isDisabled?: boolean;
  isUpgrade?: boolean;
  technologies?: TechId[];
};

export const projects: Project[] = [
  {
    title: "Pharmacy",
    image: "/work/work30.png",
    link: "#",
    status: "done",
    brand: "new",
    isDisabled: true,
    isUpgrade: true,
    technologies: ["html", "css", "tailwind", "javascript", "php", "laravel", "mysql"],
  },
  {
    title: "DNA",
    image: "/work/work28.png",
    link: "#",
    status: "done",
    brand: "new",
    isDisabled: true,
    isUpgrade: true,
    technologies: ["html", "css", "tailwind", "javascript", "php", "laravel", "mysql"],
  },
  {
    title: "Lowyer",
    image: "/work/work27.png",
    link: "https://law-firm-management-system-blue.vercel.app/",
    status: "done",
    brand: "New",
    isDisabled: true,
    isUpgrade: true,
    technologies: ["html", "css", "tailwind", "javascript", "react", "next", "node", "supabase", "framer", "typescript"],
  },
  {
    title: "Muntajatik",
    image: "/work/work29.png",
    link: "#",
    status: "done",
    brand: "New",
    isUpgrade: true,
    technologies: ["html", "css", "javascript", "react", "typescript", "node", "php", "laravel", "mysql"],
  },
  {
    title: "Eslami",
    image: "/work/work25.png",
    link: "https://mhmd309.github.io/Eslami/",
    status: "done",
  },
  {
    title: "Ramadan Kareem",
    image: "/work/work03.png",
    link: "https://ramadankareem23.iceiy.com/",
    status: "done",
  },
  {
    title: "Stop Watch",
    image: "/work/work26.png",
    link: "https://mhmd309.github.io/stopwatch/",
    status: "done",
  },
  {
    title: "Dashboard",
    image: "/work/work22.png",
    link: "https://mhmd309.github.io/Dashboard/",
    status: "done",
  },
  {
    title: "Best Car Rental",
    image: "/work/work23.png",
    link: "https://mhmd309.github.io/Car-Rental/",
    status: "done",
  },
  {
    title: "Corp Vision",
    image: "/work/work24.png",
    link: "https://mhmd309.github.io/CorpVision/",
    status: "done",
  },
  {
    title: "Afaq",
    image: "/work/work19.png",
    link: "https://mhmd309.github.io/afaq/",
    status: "done",
  },
  {
    title: "Special Design",
    image: "/work/work20.png",
    link: "https://mhmd309.github.io/Special-Design/",
    status: "done",
  },
  {
    title: "Programming",
    image: "/work/work21.png",
    link: "https://mhmd309.github.io/Programming/",
    status: "done",
  },
  {
    title: "Emara",
    image: "/work/work16.png",
    link: "https://mhmd309.github.io/Emara/",
    status: "done",
  },
  {
    title: "Bondi",
    image: "/work/work17.png",
    link: "https://mhmd309.github.io/Bondi/",
    status: "done",
  },
  {
    title: "Directone",
    image: "/work/work18.png",
    link: "https://mhmd309.github.io/directone/",
    status: "done",
  },
  {
    title: "Player",
    image: "/work/work13.png",
    link: "https://mhmd309.github.io/player/",
    status: "done",
  },
  {
    title: "HexColorRandom",
    image: "/work/work14.png",
    link: "https://mhmd309.github.io/hexColorRandom/",
    status: "done",
  },
  {
    title: "SeoGram",
    image: "/work/work15.png",
    link: "https://mhmd309.github.io/seoGram/",
    status: "done",
  },
  {
    title: "Amike",
    image: "/work/work10.png",
    link: "https://mhmd309.github.io/amike/",
    status: "done",
  },
  {
    title: "Cafena",
    image: "/work/work11.png",
    link: "https://mhmd309.github.io/cafena/",
    status: "done",
  },
  {
    title: "Kaffa",
    image: "/work/work12.png",
    link: "https://mhmd309.github.io/kaffa/",
    status: "done",
  },
  {
    title: "EliteCrop",
    image: "/work/work07.png",
    link: "https://mhmd309.github.io/EliteCrop/",
    status: "done",
  },
  {
    title: "Kasper",
    image: "/work/work08.png",
    link: "https://mhmd309.github.io/kasper/",
    status: "done",
  },
  {
    title: "XeOne",
    image: "/work/work09.jpg",
    link: "https://mhmd309.github.io/XeOne/",
    status: "done",
  },
  {
    title: "Leon",
    image: "/work/work04.png",
    link: "https://mhmd309.github.io/Leon/",
    status: "done",
  },
  {
    title: "Vex",
    image: "/work/work05.png",
    link: "https://mhmd309.github.io/vex/",
    status: "done",
  },
  {
    title: "Chomp",
    image: "/work/work06.png",
    link: "https://mhmd309.github.io/chomp/",
    status: "done",
  },
  {
    title: "BurgerBun",
    image: "/work/work01.png",
    link: "https://mhmd309.github.io/Burger-Bun/",
    status: "done",
  },
  {
    title: "Cookster",
    image: "/work/work02.png",
    link: "https://mhmd309.github.io/Cookster/",
    status: "done",
  },
];
