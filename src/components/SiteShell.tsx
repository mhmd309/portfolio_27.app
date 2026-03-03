"use client";
 
import { useState } from "react";
import type { ReactNode } from "react";
import Header from "src/components/Header";
import Sidebar from "src/components/Sidebar";
import Footer from "src/components/Footer";
import FloatingVisitorToast from "src/components/FloatingVisitorToast";
import ScrollTop from "src/components/ScrollTop";
 
 type Props = {
 children: ReactNode;
 };
 
 export default function SiteShell({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={`${sidebarOpen ? "lg:pl-72" : "lg:pl-0"} min-h-screen flex flex-col transition-[padding]`}>
        <Header onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 px-4 sm:px-8 lg:px-16">{children}</main>
        <FloatingVisitorToast />
        <ScrollTop />
        <Footer />
      </div>
    </div>
  );
 }
