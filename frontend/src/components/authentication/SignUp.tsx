"use client";

import { DefaultEmptyUser, User } from "@/type/User";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, useState } from "react";

export function SignUp() {
    const navigate = useRouter();

    const [user, setUser] = useState<User>(DefaultEmptyUser);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.name === "password") {
            setUser({
                ...user,
                authentication: {
                    ...user.authentication,
                    password: event.target.value,
                },
            });
        } else {
            setUser({ ...user, [event.target.name]: event.target.value });
        }
    };

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        })
            .then(async (res) => {
                console.log(await res.json());
                setUser(DefaultEmptyUser);
                navigate.push("/");
            })
            .catch((err) => {
                console.log("Error from CreateUser: " + err);
            });
    };
    return (
        <>
            <form noValidate onSubmit={onSubmit}>
                <input
                    type="text"
                    placeholder="username"
                    name="username"
                    value={user.username}
                    onChange={onChange}
                />
                <input
                    type="text"
                    placeholder="email"
                    name="email"
                    value={user.email}
                    onChange={onChange}
                />
                <input
                    type="text"
                    placeholder="password"
                    name="password"
                    value={user.authentication?.password}
                    onChange={onChange}
                />
                <input
                    type="text"
                    placeholder="role"
                    name="role"
                    value={user.role}
                    onChange={onChange}
                />
                <button type="submit">Submit</button>
            </form>
        </>
    );
}
