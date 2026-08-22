"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const LINK = "https://aintishar-web-app.vercel.app/";
const TITLE = "إنتشار للبرمجيات والتسويق الإلكترونى";

export default function EntisharFloat() {
  return (
    <motion.a
      href={LINK}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
      className="fixed left-4 bottom-5 z-[60] flex max-w-[min(103vw,22rem)] items-center gap-3 rounded-xl border border-white/20 bg-zinc-900/70 px-3 py-2.5 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-zinc-900"
      aria-label={TITLE}
    >
      <Image
        src="/إنتشار.png"
        alt=""
        width={36}
        height={36}
        className="h-9 w-9 shrink-0 rounded-lg"
        aria-hidden
      />
      <span className="text-sm font-medium leading-snug">{TITLE}</span>
    </motion.a>
  );
}
