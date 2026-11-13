"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Trash2, TriangleAlert, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteBookingAction } from "@/server-action/booking-action/delete-booking-action";

export default function DeleteBookingButton({ booking }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape" && !pending) {
        setOpen(false);
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, pending]);

  function openModal() {
    setError("");
    setOpen(true);
  }

  async function handleDelete() {
    setPending(true);
    setError("");

    const result = await deleteBookingAction(booking.id);

    if (result.success) {
      setPending(false);
      setOpen(false);
      router.refresh();
      return;
    }

    setPending(false);

    if (result.status === 401) {
      router.push("/sign-in");
      return;
    }

    setError(result.error);
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={openModal}
      >
        <Trash2 className="size-4" />
        Delete
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-60 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
              onClick={() => {
                if (!pending) {
                  setOpen(false);
                }
              }}
            />

            <motion.div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="delete-booking-title"
              aria-describedby="delete-booking-description"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                    <TriangleAlert className="size-5" />
                  </span>
                  <div>
                    <h2
                      id="delete-booking-title"
                      className="text-xl font-bold tracking-tight text-foreground"
                    >
                      Delete booking
                    </h2>
                    <p
                      id="delete-booking-description"
                      className="mt-1 text-sm text-muted-foreground"
                    >
                      Are you sure you want to delete your booking for{" "}
                      <span className="font-semibold text-foreground">
                        {booking.name || "this destination"}
                      </span>
                      ? This action cannot be undone.
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Close dialog"
                  disabled={pending}
                  onClick={() => setOpen(false)}
                >
                  <X className="size-5" />
                </Button>
              </div>

              {error && (
                <p className="mt-4 text-sm font-medium text-destructive">
                  {error}
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-full"
                  disabled={pending}
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="rounded-full"
                  disabled={pending}
                  onClick={handleDelete}
                >
                  <Trash2 className="size-4" />
                  {pending ? "Deleting…" : "Delete"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
