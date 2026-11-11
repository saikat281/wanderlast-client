import PageIntro from "@/components/PageIntro";

export const metadata = {
  title: "Destinations — Wanderlast",
};

export default function DestinationsPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageIntro
        eyebrow="Destinations"
        title="Find your next horizon"
        description="A curated collection of places we love. Destination cards and filters are coming next."
      />
    </main>
  );
}
