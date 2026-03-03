"use client";

import { motion } from "framer-motion";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import Image from "next/image";
import { useEffect, useState } from "react";

const socials = [
  { href: "https://www.facebook.com/elseedi99", label: "Facebook", Icon: FaFacebookF },
  { href: "https://www.instagram.com/_e_m_a_r_a_", label: "Instagram", Icon: FaInstagram },
  { href: "#", label: "LinkedIn", Icon: FaLinkedinIn },
  { href: "https://github.com/mhmd309", label: "GitHub", Icon: FaGithub },
];

export default function HeroSlider() {
  const full = "I'm Full‑Stack Developer";
  const [i, setI] = useState(0);
  const [forward, setForward] = useState(true);
  const display = full.slice(0, i);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (forward) {
      if (i < full.length) {
        t = setTimeout(() => setI(i + 1), 90);
      } else {
        t = setTimeout(() => setForward(false), 1000);
      }
    } else {
      if (i > 0) {
        t = setTimeout(() => setI(i - 1), 40);
      } else {
        t = setTimeout(() => setForward(true), 600);
      }
    }
    return () => clearTimeout(t);
  }, [i, forward, full]);
  return (
    <section
      id="hero"
      className="relative isolate min-h-screen -mx-4 sm:-mx-8 lg:-mx-16 overflow-hidden flex items-center justify-center text-white bg-[url('/cover_site.jpg')] bg-cover bg-center bg-no-repeat"
    >
      <div className="absolute inset-0 bg-black/70" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(80%_50%_at_50%_0%,rgba(255,255,255,.12),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          aria-hidden
          className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, 25, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[36rem] w-[36rem] rounded-full border border-white/10"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative w-full px-4 py-24 sm:py-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-xl"
        >
          <div className="relative mx-auto h-28 w-28 sm:h-32 sm:w-32">
            <motion.div
              className="absolute inset-0 rounded-full p-[3px] bg-[conic-gradient(at_50%_50%,_#22d3ee,_#a78bfa,_#ec4899,_#22d3ee)]"
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              aria-hidden
            >
              <div className="h-full w-full rounded-full bg-zinc-900/60" />
            </motion.div>
            <motion.div
              className="relative h-full w-full rounded-full ring-2 ring-white/20 shadow-lg overflow-hidden"
              animate={{ y: [0, -6, 0] }}
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Image
                src="/icon.png"
                alt="Profile"
                fill
                sizes="(max-width: 640px) 7rem, 8rem"
                className="object-cover"
                priority
              />
              <motion.div
                className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
                animate={{ x: ['-15%', '115%', '-15%'] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                aria-hidden
              >
                <div className="absolute -left-1/3 top-0 h-full w-1/3 bg-gradient-to-r from-white/20 via-white/5 to-transparent -skew-x-12" />
              </motion.div>
            </motion.div>
          </div>
          <h1 className="mt-5 text-3xl sm:text-5xl font-bold tracking-tight">Hello There!</h1>
          <p className="mt-1 text-zinc-300 underline">
            <span aria-label="typed">{display}</span>
            <motion.span
              className="ml-1 inline-block h-5 w-[2px] align-middle bg-zinc-300"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            />
          </p>

          <motion.div
            className="mt-6 flex items-center justify-center gap-3"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          >
            {socials.map(({ href, label, Icon }) => (
              <motion.a
                key={label}
                aria-label={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/20 bg-white/5 hover:bg-white/10 transition-colors"
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
              >
                <Icon className="h-4 w-4" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-12"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <a
            href="#about"
            aria-label="Scroll to About"
            className="inline-flex items-center justify-center h-12 w-12 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition-colors"
          >
            <FiChevronDown className="h-6 w-6" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
