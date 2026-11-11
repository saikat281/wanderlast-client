"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Pencil, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DESTINATION_CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { updateDestinationAction } from "@/server-action/destination-action/update-destination-action";

const fieldClasses =
  "w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

function toFormValues(destination) {
  return {
    name: destination.name ?? "",
    country: destination.country ?? "",
    price: destination.price ?? "",
    departureTime: destination.departureTime
      ? String(destination.departureTime).slice(0, 16)
      : "",
    imageUrl: destination.imageUrl ?? "",
    description: destination.description ?? "",
    category: destination.category ?? "",
  };
}

function Field({ label, htmlFor, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function EditDestinationModal({ destination }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(() => toFormValues(destination));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
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
  }, [open]);

  function openModal() {
    setForm(toFormValues(destination));
    setError("");
    setOpen(true);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setPending(true);
    setError("");

    const result = await updateDestinationAction(destination.id, form);

    setPending(false);

    if (result.success) {
      setOpen(false);
      router.refresh();
    } else {
      setError(result.error);
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="rounded-full"
        onClick={openModal}
      >
        <Pencil className="size-4" />
        Edit Destination
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
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-destination-title"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="edit-destination-title"
                    className="text-xl font-bold tracking-tight text-foreground"
                  >
                    Edit destination
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Update the details and save your changes.
                  </p>
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

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Destination name" htmlFor="edit-name">
                    <input
                      id="edit-name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      className={fieldClasses}
                    />
                  </Field>

                  <Field label="Country" htmlFor="edit-country">
                    <input
                      id="edit-country"
                      name="country"
                      type="text"
                      required
                      value={form.country}
                      onChange={handleChange}
                      className={fieldClasses}
                    />
                  </Field>

                  <Field label="Price (USD)" htmlFor="edit-price">
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm text-muted-foreground">
                        $
                      </span>
                      <input
                        id="edit-price"
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.price}
                        onChange={handleChange}
                        className={cn(fieldClasses, "pl-7")}
                      />
                    </div>
                  </Field>

                  <Field label="Departure time" htmlFor="edit-departureTime">
                    <input
                      id="edit-departureTime"
                      name="departureTime"
                      type="datetime-local"
                      value={form.departureTime}
                      onChange={handleChange}
                      className={fieldClasses}
                    />
                  </Field>
                </div>

                <Field label="Image URL" htmlFor="edit-imageUrl">
                  <input
                    id="edit-imageUrl"
                    name="imageUrl"
                    type="url"
                    value={form.imageUrl}
                    onChange={handleChange}
                    className={fieldClasses}
                  />
                </Field>

                <Field label="Category" htmlFor="edit-category">
                  <select
                    id="edit-category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={cn(fieldClasses, "appearance-none pr-9")}
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {DESTINATION_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Description" htmlFor="edit-description">
                  <textarea
                    id="edit-description"
                    name="description"
                    rows={4}
                    value={form.description}
                    onChange={handleChange}
                    className={cn(fieldClasses, "resize-y")}
                  />
                </Field>

                {error && (
                  <p className="text-sm font-medium text-destructive">{error}</p>
                )}

                <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    className="rounded-full"
                    disabled={pending}
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={pending} className="rounded-full">
                    <Save className="size-4" />
                    {pending ? "Saving…" : "Save changes"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
