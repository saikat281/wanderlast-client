import PageIntro from "@/components/PageIntro";

export const metadata = {
  title: "Bookings — Wanderlast",
};

export default function BookingsPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageIntro
        eyebrow="Bookings"
        title="Your journeys, all in one place"
        description="Trips you book with Wanderlast will appear here. Booking flow is coming next."
      />
    </main>
  );
}
