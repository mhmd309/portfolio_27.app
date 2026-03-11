'use client';

import { useEffect, useState } from "react";

export default function Cursor() {
  const [x, setX] = useState(-100);
  const [y, setY] = useState(-100);
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia?.("(pointer: fine)").matches;
    if (!fine) return;
    const updateHover = (el: Element | null) => {
      if (!el) {
        setHover(false);
        return;
      }
      const interactive = el.closest(
        "a,button,[role='button'],label,select,summary,input[type='button'],input[type='submit'],.cursor-pointer"
      );
      setHover(Boolean(interactive));
    };
    const onMove = (e: MouseEvent) => {
      setX(e.clientX);
      setY(e.clientY);
      updateHover(e.target as Element);
    };
    const onOver = (e: Event) => {
      updateHover(e.target as Element);
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
    };
  }, []);

  const dotScale = down ? "scale-50" : hover ? "scale-75" : "scale-100";
  const ringScale = down ? "scale-90" : hover ? "scale-150" : "scale-100";

  return (
    <>
      <div
        aria-hidden="true"
        className={`custom-cursor-ui pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-900 transition-transform duration-100 ease-out dark:bg-zinc-100 ${dotScale}`}
        style={{ left: x, top: y }}
      />
      <div
        aria-hidden="true"
        className={`custom-cursor-ui pointer-events-none fixed left-0 top-0 z-[9998] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-900/70 transition-transform duration-150 ease-out dark:border-zinc-100/70 ${ringScale}`}
        style={{ left: x, top: y }}
      />
    </>
  );
}
