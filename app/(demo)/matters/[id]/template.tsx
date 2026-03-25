"use client";

import { motion } from "motion/react";

export default function MatterTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="col-span-12 grid grid-cols-subgrid gap-y-5"
      initial={{ opacity: 0, x: 60, boxShadow: "-20px 0 60px -10px rgba(58,39,17,0.18)" }}
      animate={{ opacity: 1, x: 0, boxShadow: "0px 0 0px 0px rgba(58,39,17,0)" }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
