"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
    return (
        <div>
            <main>
                <h1>Welcome to SPEED</h1>
                <p>
                    Please <Link href="/login">Log In</Link> to continue.
                </p>
            </main>
        </div>
    );
}
