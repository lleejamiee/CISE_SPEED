import { AuthenticationContext } from "@/context/AuthContext";
import { LoginCredential, DefaultEmptyLoginCredential } from "@/type/User";
import { useContext, useEffect, useState } from "react";

export function SignIn() {
    const authContext = useContext(AuthenticationContext);

    //const { isLoggedIn, userRole, username, login } = authContext;
    const [loginDetail, setLoginDetail] = useState<LoginCredential>(
        DefaultEmptyLoginCredential
    );

    const onSubmit = () => {
        useEffect(() => {
            fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/login`)
                .then((res) => {
                    return res.json();
                })
                .then((user) => {
                    // isLoggedIn = true;
                });
        });
    };

    return (
        <>
            <form noValidate onSubmit={onSubmit}>
                <input
                    type="text"
                    placeholder="username or email"
                    name="identity"
                    value={loginDetail.identity}
                />
                <input
                    type="text"
                    placeholder="password"
                    name="password"
                    value={loginDetail.password}
                />
                <button type="submit">Login</button>
            </form>
        </>
    );
}
