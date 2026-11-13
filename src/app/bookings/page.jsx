import Link from "next/link";

import BookingCard from "@/components/BookingCard";
import PageIntro from "@/components/PageIntro";
import { Button } from "@/components/ui/button";
import { getBookingsAction } from "@/server-action/booking-action/get-bookings-action";

export const metadata = {
  title: "Bookings — Wanderlast",
};

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const { bookings, error, status } = await getBookingsAction();

  return (
    <main className="flex flex-1 flex-col">
      <PageIntro
        eyebrow="Bookings"
        title="Your journeys, all in one place"
        description="Every trip you book with Wanderlast appears here, from the first click to departure day."
      />

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
        {status === 401 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
            <h2 className="text-lg font-semibold text-foreground">
              Sign in to see your bookings
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Your trips are linked to your account, so sign in to pick up where
              you left off.
            </p>
            <Button asChild className="mt-5 rounded-full">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
            <h2 className="text-lg font-semibold text-foreground">
              We couldn&apos;t load your bookings
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          </div>
        ) : bookings.length ? (
          <>
            <p className="mb-6 text-sm text-muted-foreground">
              {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
            </p>
            <div className="flex flex-col gap-5">
              {bookings.map((booking) => (
                <BookingCard
                  key={booking._id ?? `${booking.destinationId}-${booking.createdAt}`}
                  booking={booking}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
            <h2 className="text-lg font-semibold text-foreground">
              No bookings yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Find a place worth wandering and book your first trip.
            </p>
            <Button asChild className="mt-5 rounded-full">
              <Link href="/destinations">Browse destinations</Link>
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
