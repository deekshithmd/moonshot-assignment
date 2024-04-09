export type UserType = {
    name: string;
    email: string;
    id: number;
    isVerified?: boolean;
}

export type ContextType = {
    isLoggedin?: boolean;
    setIsLoggedIn?: (val: boolean) => void;
    user?: UserType;
    setUser?: (val: UserType) => void
}