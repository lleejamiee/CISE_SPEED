"use client";

import { AuthenticationContext } from "@/context/AuthContext";
import { LoginCredential, DefaultEmptyLoginCredential } from "@/type/User";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";

export function SignIn() {
    const authContext = useContext(AuthenticationContext);
    const navigate = useRouter();

    // const { isLoggedIn, userRole, username, login } = authContext;
    const [loginCredential, setLoginCredential] = useState<LoginCredential>(
        DefaultEmptyLoginCredential
    );

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLoginCredential({
            ...loginCredential,
            [event.target.name]: event.target.value,
        });
    };

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginCredential),
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
                setLoginCredential(DefaultEmptyLoginCredential);
                navigate.push("/");
            })
            .then((user) => {
                // isLoggedIn(true)
            })
            .catch((err) => {
                console.log("Error from login: " + err);
            });
    };

    return (
        <>
            <form noValidate onSubmit={onSubmit}>
                <input
                    type="text"
                    placeholder="username or email"
                    name="identity"
                    value={loginCredential.identity}
                    onChange={onChange}
                />
                <input
                    type="text"
                    placeholder="password"
                    name="password"
                    value={loginCredential.password}
                    onChange={onChange}
                />
                <button type="submit">Login</button>
            </form>
        </>
    );
}
