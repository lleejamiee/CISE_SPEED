import ModerationQueue from "@/components/moderation/ModerationQueue";
import Navbar from "@/components/navbar/navbar";

export default function moderationPage() {
  return (
    <div>
      <header style={{ position: "sticky", top: 0, zIndex: 10 }}>
        <Navbar />
      </header>
      <main>
        <ModerationQueue />
      </main>
    </div>
  );
}
