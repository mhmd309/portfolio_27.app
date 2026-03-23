"use client";
 
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getApps, initializeApp } from "firebase/app";
import { getAnalytics, isSupported as analyticsIsSupported } from "firebase/analytics";
import Header from "src/components/Header";
import Sidebar from "src/components/Sidebar";
import Footer from "src/components/Footer";
import ScrollTop from "src/components/ScrollTop";
 
 type Props = {
 children: ReactNode;
 };

const firebaseConfig = {
  apiKey: "AIzaSyDFsyGzStzBkJZ9Od1ezZXNsoMg0RrloXA",
  authDomain: "portfolio27-d4fea.firebaseapp.com",
  projectId: "portfolio27-d4fea",
  storageBucket: "portfolio27-d4fea.firebasestorage.app",
  messagingSenderId: "296556047662",
  appId: "1:296556047662:web:49a299c45e598329d31ebf",
  measurementId: "G-PJRZ5VT465",
};

function ensureFirebaseApp() {
  if (getApps().length) return getApps()[0]!;
  return initializeApp(firebaseConfig);
}
 
 export default function SiteShell({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() => {
    const app = ensureFirebaseApp();
    analyticsIsSupported()
      .then((supported) => {
        if (supported) getAnalytics(app);
      })
      .catch(() => {});
  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={`${sidebarOpen ? "lg:pl-72" : "lg:pl-0"} min-h-screen flex flex-col transition-[padding]`}>
        <Header onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 px-4 sm:px-8 lg:px-16">{children}</main>
        <ScrollTop />
        <Footer />
      </div>
    </div>
  );
 }
