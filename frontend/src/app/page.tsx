import { SignIn } from "@/component/authentication/SignIn";
import { SignUp } from "@/component/authentication/SignUp";

export default function Home() {
    return (
        <>
            <SignUp />
            <SignIn />
        </>
    );
}
