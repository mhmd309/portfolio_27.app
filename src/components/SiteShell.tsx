"use client";
 
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Header from "src/components/Header";
import Sidebar from "src/components/Sidebar";
import Footer from "src/components/Footer";
import ScrollTop from "src/components/ScrollTop";
import EntisharFloat from "src/components/EntisharFloat";
 
 type Props = {
 children: ReactNode;
 };
 
 export default function SiteShell({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; variant: "success" | "error" | "info" }>>(
    []
  );

  useEffect(() => {
    const onToast = (e: Event) => {
      const ce = e as CustomEvent<unknown>;
      const d = ce.detail as { message?: unknown; variant?: unknown } | null;
      const message = typeof d?.message === "string" ? d.message.trim() : "";
      if (!message) return;
      const variant = d?.variant === "success" || d?.variant === "error" || d?.variant === "info" ? d.variant : "info";
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}_${Math.random()}`;
      setToasts((prev) => [...prev.slice(-2), { id, message, variant }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 2600);
    };
    window.addEventListener("app:toast", onToast);
    return () => window.removeEventListener("app:toast", onToast);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={`${sidebarOpen ? "lg:pl-72" : "lg:pl-0"} min-h-screen flex flex-col transition-[padding]`}>
        <Header onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 px-4 sm:px-8 lg:px-16">{children}</main>
        {toasts.length > 0 ? (
          <div className="fixed bottom-6 right-6 z-[80] flex max-w-[min(92vw,26rem)] flex-col gap-2">
            {toasts.map((t) => (
              <div
                key={t.id}
                role="status"
                className={
                  "rounded-xl border px-4 py-3 shadow-xl backdrop-blur bg-background/90 " +
                  (t.variant === "success"
                    ? "border-green-600/40"
                    : t.variant === "error"
                      ? "border-red-600/40"
                      : "border-zinc-200/60 dark:border-zinc-800/60")
                }
              >
                <div className="text-sm text-zinc-900 dark:text-zinc-100">{t.message}</div>
              </div>
            ))}
          </div>
        ) : null}
        <EntisharFloat />
        <ScrollTop />
        <Footer />
      </div>
    </div>
  );
 }
