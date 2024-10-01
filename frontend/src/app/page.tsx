import { SignIn } from "@/components/authentication/SignIn";
import { SignUp } from "@/components/authentication/SignUp";

export default function Home() {
    return (
        <>
            <SignUp />
            <SignIn />
        </>
    );
}
