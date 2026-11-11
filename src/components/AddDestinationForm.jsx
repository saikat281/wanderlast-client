"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check, ImageIcon, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DESTINATION_CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { addDestinationAction } from "@/server-action/destination-action/add-destination-action";

const initialForm = {
  name: "",
  country: "",
  price: "",
  departureTime: "",
  imageUrl: "",
  description: "",
  category: "",
};

const fieldClasses =
  "w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

function Field({ label, htmlFor, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-foreground"
      >
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export default function AddDestinationForm() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setSubmitted(false);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setPending(true);
    setSubmitted(false);
    setError("");

    const result = await addDestinationAction(form);

    setPending(false);

    if (result.success) {
      setSubmitted(true);
      setForm(initialForm);
    } else {
      setError(result.error);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24"
    >
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Destination name" htmlFor="name">
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="e.g. Santorini"
                value={form.name}
                onChange={handleChange}
                className={fieldClasses}
              />
            </Field>

            <Field label="Country" htmlFor="country">
              <input
                id="country"
                name="country"
                type="text"
                required
                placeholder="e.g. Greece"
                value={form.country}
                onChange={handleChange}
                className={fieldClasses}
              />
            </Field>

            <Field label="Price (USD)" htmlFor="price">
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm text-muted-foreground">
                  $
                </span>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  placeholder="1299.00"
                  value={form.price}
                  onChange={handleChange}
                  className={cn(fieldClasses, "pl-7")}
                />
              </div>
            </Field>

            <Field label="Departure time" htmlFor="departureTime">
              <input
                id="departureTime"
                name="departureTime"
                type="datetime-local"
                required
                value={form.departureTime}
                onChange={handleChange}
                className={fieldClasses}
              />
            </Field>
          </div>

          <Field label="Image URL" htmlFor="imageUrl">
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              required
              placeholder="https://example.com/santorini.jpg"
              value={form.imageUrl}
              onChange={handleChange}
              className={fieldClasses}
            />
          </Field>

          <Field label="Category" htmlFor="category">
            <select
              id="category"
              name="category"
              required
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

          <Field label="Description" htmlFor="description">
            <textarea
              id="description"
              name="description"
              required
              rows={5}
              placeholder="What makes this place special?"
              value={form.description}
              onChange={handleChange}
              className={cn(fieldClasses, "resize-y")}
            />
          </Field>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button type="submit" disabled={pending} className="rounded-full">
              <Plus className="size-4" />
              {pending ? "Adding…" : "Add Destination"}
            </Button>
            {submitted && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
                <Check className="size-4" />
                Destination added successfully.
              </span>
            )}
            {error && (
              <span className="text-sm font-medium text-destructive">
                {error}
              </span>
            )}
          </div>
        </form>

        <aside className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-muted">
            {form.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.imageUrl}
                alt={form.name ? `${form.name} preview` : "Destination preview"}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 p-6 text-center text-muted-foreground">
                <ImageIcon className="size-8" />
                <p className="text-sm">Image preview</p>
                <p className="text-xs">Paste an image URL to see it here.</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  {form.name || "Destination name"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {form.country || "Country"}
                </p>
              </div>
              {form.category && (
                <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
                  {form.category}
                </span>
              )}
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="font-semibold text-primary">
                {form.price ? `$${Number(form.price).toLocaleString()}` : "$0"}
              </span>
              {form.departureTime && (
                <span>
                  Departs {new Date(form.departureTime).toLocaleString()}
                </span>
              )}
            </div>

            <p className="mt-2 line-clamp-4 text-sm leading-6 text-muted-foreground">
              {form.description ||
                "Your description will appear here as you type."}
            </p>
          </div>
        </aside>
      </div>
    </motion.div>
  );
}
