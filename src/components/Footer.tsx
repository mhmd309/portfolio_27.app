 export default function Footer() {
  return (
    <footer className="border-t border-zinc-200/60 dark:border-zinc-800/60 mt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-sm text-zinc-600 dark:text-zinc-400 text-center">
        <p>
          Copyright © 2019 - {new Date().getFullYear()} All Rights Reserved
        </p>
      </div>
    </footer>
  );
 }
