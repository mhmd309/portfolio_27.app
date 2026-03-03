 "use client";
 
 import { useEffect, useState } from "react";
 import { FiChevronUp } from "react-icons/fi";
 import { motion, AnimatePresence } from "framer-motion";
 
 export default function ScrollTop() {
   const [show, setShow] = useState(false);
 
   useEffect(() => {
     const onScroll = () => setShow(window.scrollY > 300);
     onScroll();
     window.addEventListener("scroll", onScroll, { passive: true });
     return () => window.removeEventListener("scroll", onScroll);
   }, []);
 
   const handleClick = () => {
     window.scrollTo({ top: 0, behavior: "smooth" });
   };
 
   return (
     <AnimatePresence>
       {show && (
        <motion.button
           initial={{ opacity: 0, y: 12 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: 12 }}
           transition={{ duration: 0.2 }}
           onClick={handleClick}
           aria-label="Scroll to top"
          className="fixed right-4 bottom-22 z-[60] inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-zinc-900/70 text-white backdrop-blur-md hover:bg-zinc-900 transition-colors cursor-pointer"
         >
           <FiChevronUp className="h-5 w-5" />
         </motion.button>
       )}
     </AnimatePresence>
   );
 }
