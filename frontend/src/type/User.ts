export type User = {
    _id?: string;
    username?: string;
    email?: string;
    authentication?: Authentication;
    role?: string;
};

export type Authentication = {
    password?: string;
    salt?: string;
    sessionToken?: string;
};

export const DefaultEmptyUser: User = {
    _id: undefined,
    username: "",
    email: "",
    authentication: { password: "" },
    role: "",
};

export type LoginCredential = {
    identity: string;
    password?: string;
};

export const DefaultEmptyLoginCredential: LoginCredential = {
    identity: "",
    password: "",
};
