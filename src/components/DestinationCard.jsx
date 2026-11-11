import Link from "next/link";
import { ArrowRight, CalendarClock, MapPin } from "lucide-react";

import { formatDeparture, formatPrice } from "@/lib/format";

export default function DestinationCard({ destination }) {
  const {
    _id,
    name,
    country,
    price,
    departureTime,
    imageUrl,
    description,
    category,
  } = destination;

  const id = _id == null ? null : String(_id);
  const formattedPrice = formatPrice(price);
  const formattedDeparture = formatDeparture(departureTime);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={name ? `${name}, ${country}` : "Destination"}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-accent to-muted text-sm text-muted-foreground">
            No image
          </div>
        )}

        {category && (
          <span className="absolute top-3 left-3 rounded-full bg-background/85 px-2.5 py-1 text-xs font-semibold text-primary backdrop-blur">
            {category}
          </span>
        )}

        {formattedPrice && (
          <span className="absolute right-3 bottom-3 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground shadow-sm">
            {formattedPrice}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            {name}
          </h2>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            {country}
          </p>
        </div>

        {description && (
          <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
          {formattedDeparture ? (
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <CalendarClock className="size-3.5 shrink-0" />
              Departs {formattedDeparture}
            </p>
          ) : (
            <span />
          )}

          {id && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
              View details
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          )}
        </div>
      </div>

      {id && (
        <Link
          href={`/destinations/${id}`}
          aria-label={`View details for ${name}`}
          className="absolute inset-0 rounded-xl focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
        />
      )}
    </article>
  );
}
