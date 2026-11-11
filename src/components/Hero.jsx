"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, MapPin, Star } from "lucide-react";

import { Button } from "@/components/ui/button";

const stats = [
  { value: "120+", label: "Destinations" },
  { value: "8k+", label: "Happy travelers" },
  { value: "4.9", label: "Average rating" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero() {
  return (
    <section className="relative flex flex-1 items-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-24 size-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-24 -right-24 size-96 rounded-full bg-accent blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <motion.div
          initial="hidden"
          animate="show"
          className="flex flex-col items-start gap-6"
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur"
          >
            <Star className="size-4 fill-primary text-primary" />
            Trusted by travelers worldwide
          </motion.span>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl"
          >
            Wander further.
            <br />
            <span className="bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">
              Remember it forever.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="max-w-xl text-lg leading-8 text-muted-foreground"
          >
            Handpicked destinations, effortless bookings, and journeys designed
            around the way you love to travel.
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={3}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <Button asChild size="lg" className="group rounded-full">
              <Link href="/destinations">
                <MapPin className="size-4" />
                Explore destinations
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link href="/bookings">View bookings</Link>
            </Button>
          </motion.div>

          <motion.dl
            variants={fadeUp}
            custom={4}
            className="mt-8 grid w-full max-w-lg grid-cols-3 gap-6 border-t border-border pt-8"
          >
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-sm text-muted-foreground">{stat.label}</dt>
                <dd className="mt-1 text-2xl font-semibold text-foreground">
                  {stat.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </div>
    </section>
  );
}
