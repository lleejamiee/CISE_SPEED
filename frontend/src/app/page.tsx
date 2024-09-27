import { SignIn } from "@/component/authentication/SignIn";
import { SignUp } from "@/component/authentication/SignUp";
import { AuthenticationProvider } from "@/context/AuthContext";

export default function Home() {
    return (
        <AuthenticationProvider>
            <SignUp />
            <SignIn />
        </AuthenticationProvider>
    );
}
