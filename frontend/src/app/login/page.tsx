"use client";

import { SignUp } from "@/components/authentication/SignUp";
import { SignIn } from "@/components/authentication/SignIn";
import { useState } from "react";

export default function LoginPage() {
    const [showSignUp, setShowSignUp] = useState(false);

    return (
        <div>
            <main>
                <h1>SPEED</h1>
                <h3>Please Log in to Continue</h3>
                {showSignUp ? <SignUp /> : <SignIn />}
                <button onClick={() => setShowSignUp(!showSignUp)}>
                    {showSignUp ? "Go to Login" : "Go to Sign Up"}
                </button>
            </main>
        </div>
    );
}
