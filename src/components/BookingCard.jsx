import { CalendarClock, MapPin } from "lucide-react";

import DeleteBookingButton from "@/components/DeleteBookingButton";
import { formatDeparture, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const statusStyles = {
  pending: "bg-amber-500/10 text-amber-600",
  confirmed: "bg-emerald-500/10 text-emerald-600",
  cancelled: "bg-destructive/10 text-destructive",
};

function formatBookedOn(createdAt) {
  if (!createdAt) {
    return null;
  }

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BookingCard({ booking }) {
  const {
    _id,
    name,
    country,
    price,
    departureTime,
    imageUrl,
    category,
    status = "pending",
    createdAt,
  } = booking;

  const formattedPrice = formatPrice(price);
  const formattedDeparture = formatDeparture(departureTime);
  const bookedOn = formatBookedOn(createdAt);
  const statusClass = statusStyles[status] ?? statusStyles.pending;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm sm:flex-row">
      <div className="relative aspect-[4/3] shrink-0 bg-muted sm:aspect-auto sm:w-56">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={name ? `${name}, ${country}` : "Destination"}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full min-h-40 items-center justify-center bg-gradient-to-br from-accent to-muted text-sm text-muted-foreground">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              {name || "Destination"}
            </h2>
            {country && (
              <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-3.5 shrink-0" />
                {country}
              </p>
            )}
          </div>

          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
              statusClass,
            )}
          >
            {status}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {formattedDeparture && (
            <span className="flex items-center gap-1.5">
              <CalendarClock className="size-4 shrink-0" />
              Departs {formattedDeparture}
            </span>
          )}
          {formattedPrice && (
            <span className="font-semibold text-foreground">
              {formattedPrice} USD
            </span>
          )}
          {category && (
            <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
              {category}
            </span>
          )}
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
          <span>
            {bookedOn ? `Booked on ${bookedOn}` : ""}
            {_id ? ` · Ref ${String(_id).slice(-6).toUpperCase()}` : ""}
          </span>

          {_id && (
            <DeleteBookingButton
              booking={{ id: String(_id), name: name || "this destination" }}
            />
          )}
        </div>
      </div>
    </article>
  );
}
