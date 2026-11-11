"use client";

import { motion } from "motion/react";

export default function PageIntro({ eyebrow, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24"
    >
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-8 text-muted-foreground">
        {description}
      </p>
    </motion.div>
  );
}
