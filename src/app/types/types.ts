export type UserType = {
    name: string;
    email: string;
    id: number;
    verified?: boolean;
    token?: string;
}

export type ContextType = {
    isLoggedin: boolean;
    setIsLoggedIn?: (val: boolean) => void;
    user: UserType;
    setUser?: (val: UserType) => void
}

export type SignupDataType = {
    name: string; email: string; password: string
}