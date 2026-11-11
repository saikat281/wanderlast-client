import Link from "next/link";

import DestinationCard from "@/components/DestinationCard";
import PageIntro from "@/components/PageIntro";
import { Button } from "@/components/ui/button";
import { getDestinationsAction } from "@/server-action/destination-action/get-destinations-action";

export const metadata = {
  title: "Destinations — Wanderlast",
};

export const dynamic = "force-dynamic";

export default async function DestinationsPage() {
  const { destinations, error } = await getDestinationsAction();

  return (
    <main className="flex flex-1 flex-col">
      <PageIntro
        eyebrow="Destinations"
        title="Find your next horizon"
        description="A curated collection of places we love. Every destination added to Wanderlast appears here."
      />

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
        {error && !destinations.length ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
            <h2 className="text-lg font-semibold text-foreground">
              We couldn&apos;t load destinations
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          </div>
        ) : destinations.length ? (
          <>
            <p className="mb-6 text-sm text-muted-foreground">
              {destinations.length}{" "}
              {destinations.length === 1 ? "destination" : "destinations"}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {destinations.map((destination) => (
                <DestinationCard
                  key={destination._id ?? `${destination.name}-${destination.country}`}
                  destination={destination}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
            <h2 className="text-lg font-semibold text-foreground">
              No destinations yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Be the first to share a place worth wandering.
            </p>
            <Button asChild className="mt-5 rounded-full">
              <Link href="/add-destination">Add a destination</Link>
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
