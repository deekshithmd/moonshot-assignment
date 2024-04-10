'use client'
import React, { useContext, createContext, useState, useEffect } from 'react';
import { type ContextType, type UserType } from '../types/types';

const DataContext = createContext<ContextType>({
    isLoggedin: false,
    user: { name: '', email: '', id: 0 }
});

const DataProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedin, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<UserType>({ name: '', email: '', id: 0 });

    useEffect(() => {
        if (sessionStorage.getItem('auth-token')) {
            setUser(JSON.parse(sessionStorage.getItem('user') ?? '') as UserType)
            setIsLoggedIn(true)
        }
    }, [])

    return (
        <DataContext.Provider value={{ isLoggedin, setIsLoggedIn, user, setUser }}>
            {children}
        </DataContext.Provider>
    )
}

const useData = () => useContext(DataContext);

export { DataProvider, useData }