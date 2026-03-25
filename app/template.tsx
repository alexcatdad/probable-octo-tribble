"use client";

import { motion } from "motion/react";

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.94, boxShadow: "0 40px 80px -20px rgba(58,39,17,0.35)" }}
      animate={{ opacity: 1, y: 0, scale: 1, boxShadow: "0 0px 0px 0px rgba(58,39,17,0)" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
