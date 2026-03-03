 "use client";
 
 import Link from "next/link";
import { FiMenu } from "react-icons/fi";
 
type Props = {
  onToggleSidebar: () => void;
};

export default function Header({ onToggleSidebar }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/60 dark:border-zinc-800/60 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg tracking-tight">
          Portfolio
        </Link>
        <button
          aria-label="Toggle sidebar"
          onClick={onToggleSidebar}
          className="inline-flex items-center justify-center rounded-md p-2 bg-zinc-100 cursor-pointer"
        >
          <FiMenu className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
 }
