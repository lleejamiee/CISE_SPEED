import { SignIn } from "@/components/authentication/SignIn";
import { SignUp } from "@/components/authentication/SignUp";
import Navbar from "@/components/navbar/navbar";

export default function Home() {
    return (
        <div>
            <Navbar />
            <main>
                <h1>Content Goes Here</h1>
            </main>
            <SignUp />
            <SignIn />
        </div>
    );
}
