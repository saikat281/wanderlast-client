import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  DollarSign,
  MapPin,
  Tag,
} from "lucide-react";

import BookTripButton from "@/components/BookTripButton";
import DeleteDestinationButton from "@/components/DeleteDestinationButton";
import EditDestinationModal from "@/components/EditDestinationModal";
import { formatDeparture, formatPrice } from "@/lib/format";
import { getDestinationAction } from "@/server-action/destination-action/get-destination-action";

export const metadata = {
  title: "Destination — Wanderlast",
};

export const dynamic = "force-dynamic";

function Info({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </dt>
      <dd className="mt-1.5 text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

export default async function DestinationDetailsPage({ params }) {
  const { id } = await params;
  const { success, destination } = await getDestinationAction(id);

  if (!success || !destination) {
    notFound();
  }

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
    <main className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <Link
          href="/destinations"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to destinations
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt={name ? `${name}, ${country}` : "Destination"}
                className="aspect-[4/3] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br from-accent to-muted text-sm text-muted-foreground">
                No image
              </div>
            )}
          </div>

          <div className="flex flex-col">
            {category && (
              <span className="w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold tracking-wide text-accent-foreground uppercase">
                {category}
              </span>
            )}

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {name}
            </h1>

            <p className="mt-2 flex items-center gap-1.5 text-base text-muted-foreground">
              <MapPin className="size-4 shrink-0" />
              {country}
            </p>

            {description && (
              <p className="mt-6 text-base leading-8 text-muted-foreground">
                {description}
              </p>
            )}

            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              <Info
                label="Price"
                value={formattedPrice ? `${formattedPrice} USD` : "—"}
                icon={DollarSign}
              />
              <Info
                label="Departure"
                value={formattedDeparture ?? "—"}
                icon={CalendarClock}
              />
              <Info label="Category" value={category || "—"} icon={Tag} />
              <Info label="Country" value={country || "—"} icon={MapPin} />
            </dl>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <BookTripButton
                destination={{
                  id: String(destination._id),
                  name: name ?? "",
                  country: country ?? "",
                  price: price ?? "",
                  departureTime: departureTime ?? "",
                  imageUrl: imageUrl ?? "",
                  description: description ?? "",
                  category: category ?? "",
                }}
              />
              <EditDestinationModal
                destination={{
                  id: String(destination._id),
                  name: name ?? "",
                  country: country ?? "",
                  price: price ?? "",
                  departureTime: departureTime ?? "",
                  imageUrl: imageUrl ?? "",
                  description: description ?? "",
                  category: category ?? "",
                }}
              />
              <DeleteDestinationButton
                destination={{
                  id: String(destination._id),
                  name: name ?? "",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
