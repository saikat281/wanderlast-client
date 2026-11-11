import { CalendarClock, MapPin } from "lucide-react";

function formatPrice(price) {
  const value = Number(price);

  if (price === "" || price == null || Number.isNaN(value)) {
    return null;
  }

  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function formatDeparture(departureTime) {
  if (!departureTime) {
    return null;
  }

  const date = new Date(departureTime);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function DestinationCard({ destination }) {
  const {
    name,
    country,
    price,
    departureTime,
    imageUrl,
    description,
    category,
  } = destination;

  const formattedPrice = formatPrice(price);
  const formattedDeparture = formatDeparture(departureTime);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
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

        {formattedDeparture && (
          <p className="mt-auto flex items-center gap-1.5 border-t border-border pt-3 text-xs font-medium text-muted-foreground">
            <CalendarClock className="size-3.5 shrink-0" />
            Departs {formattedDeparture}
          </p>
        )}
      </div>
    </article>
  );
}
