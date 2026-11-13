"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { CalendarCheck, CircleCheck, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { addBookingAction } from "@/server-action/booking-action/add-booking-action";

export default function BookTripButton({ destination }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = setTimeout(() => setToast(""), 4000);

    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = setTimeout(() => {
      router.push("/bookings");
      router.refresh();
    }, 1500);

    return () => clearTimeout(timer);
  }, [toast, router]);

  async function handleBook() {
    setPending(true);
    setError("");

    const result = await addBookingAction({
      destinationId: destination.id,
      destination: {
        name: destination.name,
        country: destination.country,
        price: destination.price,
        departureTime: destination.departureTime,
        imageUrl: destination.imageUrl,
        description: destination.description,
        category: destination.category,
      },
    });

    setPending(false);

    if (result.success) {
      setToast(result.message || "Booking created successfully.");
      return;
    }

    if (result.status === 401) {
      router.push("/sign-in");
      return;
    }

    setError(result.error);
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        size="lg"
        className="rounded-full"
        onClick={handleBook}
        disabled={pending}
      >
        <CalendarCheck className="size-4" />
        {pending ? "Booking…" : "Book this trip"}
      </Button>

      {error && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: -24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-20 z-60 mx-auto flex w-fit max-w-md items-start gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-2xl"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
              <CircleCheck className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Booking confirmed
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">{toast}</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Dismiss notification"
              className="size-7 shrink-0"
              onClick={() => setToast("")}
            >
              <X className="size-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
