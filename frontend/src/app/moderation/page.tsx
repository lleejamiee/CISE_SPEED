'use client'

// Moderation page that renders the Navbar and ModerationQueue components.
import ModerationQueue from "@/components/ModerationQueue"
import Navbar from "@/components/navbar"

export default function Moderation() {
    return (
        <div>
          <Navbar />
          <ModerationQueue />
        </div>
      );
}