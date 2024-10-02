import ModerationQueue from "@/components/moderation/ModerationQueue"
import Navbar from "@/components/navbar"

// Moderation page that renders the Navbar and ModerationQueue components.
export default function Moderation() {
    return (
        <div className="flex flex-col h-screen overflow-hidden">
          <Navbar />
          <ModerationQueue />
        </div>
      );
}