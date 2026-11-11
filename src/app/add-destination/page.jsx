import AddDestinationForm from "@/components/AddDestinationForm";
import PageIntro from "@/components/PageIntro";

export const metadata = {
  title: "Add Destination — Wanderlast",
};

export default function AddDestinationPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageIntro
        eyebrow="Add Destination"
        title="Share a place worth wandering"
        description="Fill in the details below to add a new destination to the Wanderlast collection."
      />
      <AddDestinationForm />
    </main>
  );
}
