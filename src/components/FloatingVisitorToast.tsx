"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUsers, FiX, FiEye } from "react-icons/fi";
 
 const STORAGE_KEYS = {
   id: "cv_unique_visitor_id",
   total: "cv_total_visits",
 };
 
 function getOrCreateVisitorId() {
   try {
     const existing = localStorage.getItem(STORAGE_KEYS.id);
     if (existing) return existing;
     const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
     localStorage.setItem(STORAGE_KEYS.id, id);
     return id;
   } catch {
     return "anon";
   }
 }
 
 function incrementUniqueOnce(): number {
   try {
     const id = getOrCreateVisitorId();
     const seenKey = `${STORAGE_KEYS.id}:seen:${id}`;
     const already = localStorage.getItem(seenKey);
     let total = Number(localStorage.getItem(STORAGE_KEYS.total) || "0");
     if (!already) {
       total += 1;
       localStorage.setItem(STORAGE_KEYS.total, String(total));
       localStorage.setItem(seenKey, "1");
     }
     return total;
   } catch {
     return 1;
   }
 }
 
 export default function FloatingVisitorToast() {
   const [open, setOpen] = useState(false);
   const [count, setCount] = useState<number>(0);
  const formatted = new Intl.NumberFormat().format(count);
 
   useEffect(() => {
     // Delay to avoid jank at first paint
     const t = setTimeout(() => {
       const total = incrementUniqueOnce();
       setCount(total);
       setOpen(true);
     }, 600);
     return () => clearTimeout(t);
   }, []);
 
   return (
     <AnimatePresence>
       {open && (
         <motion.div
           initial={{ opacity: 0, y: 20, scale: 0.98 }}
           animate={{ opacity: 1, y: 0, scale: 1 }}
           exit={{ opacity: 0, y: 20, scale: 0.98 }}
           transition={{ duration: 0.25 }}
           className="fixed right-4 bottom-4 z-[60] max-w-xs"
           role="status"
           aria-live="polite"
         >
          <div className="rounded-xl border border-white/15 bg-black/70 backdrop-blur-md text-white shadow-lg">
             <div className="flex items-start gap-3 p-3">
               <div className="mt-0.5 shrink-0">
                 <FiUsers className="h-5 w-5" />
               </div>
              <div className="text-sm leading-5">
                 <div className="font-semibold">Visitors</div>
                 <div className="text-white/90 font-mono text-base inline-flex items-center gap-2">
                   <FiEye className="h-4 w-4" />
                   <span>{formatted}</span>
                 </div>
               </div>
               <button
                 onClick={() => setOpen(false)}
                 aria-label="Close"
                 className="ml-auto rounded-md p-1 hover:bg-white/10 transition-colors cursor-pointer"
               >
                 <FiX className="h-4 w-4" />
               </button>
             </div>
           </div>
         </motion.div>
       )}
     </AnimatePresence>
   );
 }
